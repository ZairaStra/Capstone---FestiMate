package zairastra.capstone_be.services;

import jakarta.persistence.criteria.Join;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import zairastra.capstone_be.entities.*;
import zairastra.capstone_be.entities.enums.UnitStatus;
import zairastra.capstone_be.exceptions.BadRequestException;
import zairastra.capstone_be.exceptions.NotFoundException;
import zairastra.capstone_be.payloads.ReservationRegistrationDTO;
import zairastra.capstone_be.repositories.*;
import zairastra.capstone_be.tools.MailgunSender;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Service
@Slf4j
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private FestivalRepository festivalRepository;

    @Autowired
    private CampingRepository campingRepository;

    @Autowired
    private CampingUnitRepository campingUnitRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PublicUserRepository publicUserRepository;

    @Autowired
    private MailgunSender mailgunSender;

    @Transactional
    public Reservation createReservation(ReservationRegistrationDTO payload, PublicUser authenticatedUser) {

        Festival festival = festivalRepository.findById(payload.festivalId())
                .orElseThrow(() -> new NotFoundException("Festival not found"));

        int currentTickets = reservationRepository.countTotalTicketsByFestival(festival);
        if (currentTickets + payload.numTickets() > festival.getMaxNumbPartecipants()) {
            throw new BadRequestException("Festival is sold out or not enough tickets available");
        }

        Set<CampingUnit> campingUnits = new HashSet<>();
        if (payload.campingUnitIds() != null && !payload.campingUnitIds().isEmpty()) {
            for (Long unitId : payload.campingUnitIds()) {
                CampingUnit unit = campingUnitRepository.findById(unitId)
                        .orElseThrow(() -> new NotFoundException("Camping unit not found: " + unitId));

                boolean isOccupied = reservationRepository.existsReservationForCampingUnitAndDates(
                        unit, payload.startDate(), payload.endDate()
                );

                if (isOccupied || unit.getStatus() == UnitStatus.OCCUPIED) {
                    throw new BadRequestException("Camping unit " + unit.getSpotCode() + " is not available");
                }

                campingUnits.add(unit);
            }
        }
        double totalPrice = 0.1;
        totalPrice = payload.numTickets() * festival.getDailyPrice();
        for (CampingUnit unit : campingUnits) {
            totalPrice += unit.getAccomodationType().getPricePerNight();
        }

        Reservation reservation = new Reservation(
                authenticatedUser,
                festival,
                payload.startDate(),
                payload.endDate(),
                payload.numTickets(),
                totalPrice,
                campingUnits
        );

        Reservation saved = reservationRepository.save(reservation);

        mailgunSender.sendReservationEmail(authenticatedUser, festival, saved);

        for (CampingUnit unit : campingUnits) {
            unit.setStatus(UnitStatus.OCCUPIED);
            campingUnitRepository.save(unit);
        }

        updateFestivalCapacity(festival.getId(), payload.numTickets());

        log.info("Reservation created in festival " + festival.getName());
        return saved;
    }


    @Transactional
    public void updateFestivalCapacity(Long festivalId, int ticketsSold) {
        Festival festival = festivalRepository.findById(festivalId)
                .orElseThrow(() -> new NotFoundException("Festival not found"));

        int newCapacity = Math.max(0, festival.getMaxNumbPartecipants() - ticketsSold);
        festival.setMaxNumbPartecipants(newCapacity);
        festivalRepository.save(festival);
    }


    public Page<Reservation> findAllReservations(int page, int size, String sortBy) {

        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());

        return reservationRepository.findAll(pageable);
    }

    public Reservation findReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation with id " + id + " not found"));
    }

    public Page<Reservation> searchReservations(Long festivalId, Long campingId, Long userId,
                                                LocalDate startDate, LocalDate endDate,
                                                int page, int size, String sortBy, String direction) {

        if (size > 50) size = 50;

        Specification<Reservation> festivalSpec = (root, query, builder) -> {
            if (festivalId == null) return null;
            Festival festival = festivalRepository.findById(festivalId)
                    .orElseThrow(() -> new NotFoundException("Festival not found"));
            return builder.equal(root.get("festival"), festival);
        };

        Specification<Reservation> campingSpec = (root, query, builder) -> {
            if (campingId == null) return null;
            query.distinct(true);
            Join<Reservation, CampingUnit> join = root.join("campingUnits");
            Join<CampingUnit, AccomodationType> accJoin = join.join("accomodationType");
            Join<AccomodationType, Camping> campingJoin = accJoin.join("camping");
            return builder.equal(campingJoin.get("id"), campingId);
        };

        Specification<Reservation> userSpec = (root, query, builder) -> {
            if (userId == null) return null;
            PublicUser user = publicUserRepository.findById(userId)
                    .orElseThrow(() -> new NotFoundException("User not found"));
            return builder.equal(root.get("user"), user);
        };

        Specification<Reservation> dateSpec = (root, query, builder) -> {
            if (startDate != null && endDate != null) {
                return builder.and(
                        builder.lessThanOrEqualTo(root.get("startDate"), endDate),
                        builder.greaterThanOrEqualTo(root.get("endDate"), startDate)
                );
            } else if (startDate != null) {
                return builder.greaterThanOrEqualTo(root.get("endDate"), startDate);
            } else if (endDate != null) {
                return builder.lessThanOrEqualTo(root.get("startDate"), endDate);
            } else {
                return null;
            }
        };

        Specification<Reservation> spec = Specification
                .where(festivalSpec)
                .and(campingSpec)
                .and(userSpec)
                .and(dateSpec);

        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return reservationRepository.findAll(spec, pageable);
    }

//
//    public Page<Reservation> findByFestival(Long festivalId, int page, int size, String sortBy) {
//
//        if (size > 50) size = 50;
//        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
//
//        Festival festival = festivalRepository.findById(festivalId)
//                .orElseThrow(() -> new NotFoundException("Festival not found"));
//
//        Page<Reservation> reservations = reservationRepository.findByFestival(festival, pageable);
//        if (reservations.isEmpty()) {
//            throw new NotFoundException("No reservations found for this festival");
//        }
//
//        return reservations;
//    }
//


    public Page<Reservation> findMyReservations(Long userId, int page, int size, String sortBy) {
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());

        PublicUser publicUser = publicUserRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return reservationRepository.findByUser(publicUser, pageable);
    }


    public void deleteReservation(Long id) {
        Reservation reservation = findReservationById(id);

        for (CampingUnit unit : reservation.getCampingUnits()) {
            unit.setStatus(UnitStatus.AVAILABLE);
            campingUnitRepository.save(unit);
        }

        reservationRepository.delete(reservation);

        mailgunSender.sendCancellationEmail(reservation.getUser(), reservation.getFestival(), reservation);

        log.info("The reservation has been deleted");
    }
}
