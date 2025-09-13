package zairastra.capstone_be.services;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import zairastra.capstone_be.entities.*;
import zairastra.capstone_be.entities.enums.Genre;
import zairastra.capstone_be.entities.enums.UnitStatus;
import zairastra.capstone_be.entities.enums.UnitType;
import zairastra.capstone_be.exceptions.BadRequestException;
import zairastra.capstone_be.exceptions.NotFoundException;
import zairastra.capstone_be.payloads.FestivalRegistrationDTO;
import zairastra.capstone_be.payloads.FestivalUpdateDTO;
import zairastra.capstone_be.repositories.AccomodationTypeRepository;
import zairastra.capstone_be.repositories.CampingRepository;
import zairastra.capstone_be.repositories.CampingUnitRepository;
import zairastra.capstone_be.repositories.FestivalRepository;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
public class FestivalService {

    @Autowired
    private FestivalRepository festivalRepository;

    @Autowired
    private CampingRepository campingRepository;

    @Autowired
    private CampingUnitRepository campingUnitRepository;

    @Autowired
    private AccomodationTypeRepository accomodationTypeRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Transactional
    public Festival createFestival(FestivalRegistrationDTO payload, Admin admin) throws IOException {

        if (festivalRepository.existsByName(payload.name())) {
            throw new BadRequestException("A festival with name '" + payload.name() + "' already exists");
        }

        Festival festival = new Festival(
                payload.name(),
                null,
                payload.city(),
                payload.country(),
                payload.startDate(),
                payload.endDate(),
                payload.maxNumbPartecipants(),
                payload.dailyPrice(),
                admin
        );


        if (payload.coverImg() != null && !payload.coverImg().isEmpty()) {
            String coverUrl = cloudinaryService.uploadFile(payload.coverImg());
            festival.setCoverImg(coverUrl);
        }

        if (payload.startDate().isAfter(payload.endDate())) {
            throw new BadRequestException("Festival start date must be before end date");
        }

        festivalRepository.save(festival);

        if (payload.campingMap() != null && !payload.campingMap().isEmpty()) {
            String campingMapUrl = cloudinaryService.uploadFile(payload.campingMap());
            festival.setCampingMap(campingMapUrl);

            String campingMapSvg = new String(payload.campingMap().getBytes(), StandardCharsets.UTF_8);
            createCampingAndUnits(festival, campingMapSvg, Collections.emptyMap());
        }

        return festival;
    }

    @Transactional
    public void setAccomodationTypePrices(Long festivalId, Map<UnitType, Double> pricesByUnitType) {
        Festival festival = findFestivalById(festivalId);
        Camping camping = campingRepository.findByFestival(festival)
                .orElseThrow(() -> new NotFoundException("Camping for festival not found"));

        List<AccomodationType> accTypes = accomodationTypeRepository.findByCamping(camping);
        for (AccomodationType accType : accTypes) {
            accType.setPricePerNight(pricesByUnitType.getOrDefault(accType.getUnitType(), 0.0));
            accomodationTypeRepository.save(accType);
        }

        log.info("Prices updated for festival " + festival.getName());
    }

    private void createCampingAndUnits(Festival festival, String campingMapSvg, Map<UnitType, Double> pricesByUnitType) {

        Camping camping = campingRepository.findByFestival(festival)
                .orElseGet(() -> {
                    Camping newCamping = new Camping();
                    newCamping.setFestival(festival);
                    newCamping.setName(festival.getName() + " Camping");
                    newCamping.setOpeningDate(festival.getStartDate());
                    newCamping.setClosingDate(festival.getEndDate());
                    newCamping.setCapacity(1);
                    return campingRepository.save(newCamping); // salva solo se nuovo
                });

        List<String> svgElements = parseSvgElements(campingMapSvg);
        Map<UnitType, List<String>> unitsByType = new HashMap<>();
        for (String label : svgElements) {
            String[] parts = label.split("_");
            try {
                UnitType type = UnitType.valueOf(parts[0].toUpperCase());
                unitsByType.computeIfAbsent(type, k -> new ArrayList<>()).add(parts[1]);
            } catch (IllegalArgumentException e) {
            }
        }

        log.info("Parsed SVG labels: " + svgElements);
        log.info("Units by type: " + unitsByType);

        if (!unitsByType.isEmpty()) {
            List<AccomodationType> accTypes = accomodationTypeRepository.findByCamping(camping);
            for (AccomodationType accType : accTypes) {
                campingUnitRepository.deleteByAccomodationType(accType);
                accomodationTypeRepository.delete(accType);
            }
        }

        for (Map.Entry<UnitType, List<String>> entry : unitsByType.entrySet()) {
            UnitType type = entry.getKey();
            List<String> spotCodes = entry.getValue();
            double pricePerNight = pricesByUnitType.getOrDefault(type, 0.1);

            AccomodationType accomodationType = new AccomodationType();
            accomodationType.setCamping(camping);
            accomodationType.setUnitType(type);
            accomodationType.setUnitCapacity(getCapacityFromUnitType(type));
            accomodationType.setPricePerNight(pricePerNight);
            accomodationTypeRepository.save(accomodationType);

            for (String spotCode : spotCodes) {
                CampingUnit unit = new CampingUnit();
                unit.setAccomodationType(accomodationType);
                unit.setSpotCode(spotCode);
                unit.setStatus(UnitStatus.AVAILABLE);
                campingUnitRepository.save(unit);

                log.info("Saved accomodationType: " + accomodationType.getUnitType());
                log.info("Saved camping unit: " + unit.getSpotCode());
            }
        }

        updateCampingCapacity(camping);
    }

    private void updateCampingCapacity(Camping camping) {
        int totalCapacity = 1;
        for (AccomodationType accType : accomodationTypeRepository.findByCamping(camping)) {
            int unitsCount = (int) campingUnitRepository.countByAccomodationType(accType);
            totalCapacity += accType.getUnitCapacity() * unitsCount;
        }
        camping.setCapacity(totalCapacity);
        campingRepository.save(camping);
    }

    private List<String> parseSvgElements(String campingMapSvg) {
        List<String> labels = new ArrayList<>();
        try {
            Document doc = Jsoup.parse(campingMapSvg, "", org.jsoup.parser.Parser.xmlParser());
            Elements elementsWithId = doc.select("[id], [data-label]");
            for (Element el : elementsWithId) {
                String label = el.hasAttr("data-label") ? el.attr("data-label") : el.attr("id");
                if (label != null && !label.isEmpty()) {
                    labels.add(label.trim());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return labels;
    }

    private int getCapacityFromUnitType(UnitType type) {
        return switch (type) {
            case TENT1 -> 1;
            case TENT2 -> 2;
            case TENT4, BUNGALOW4 -> 4;
            case TENT6 -> 6;
            case BUBBLE2 -> 2;
        };
    }

    public Page<Festival> findAllFestivals(int page, int size, String sortBy) {
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return festivalRepository.findAll(pageable);
    }

    public Festival findFestivalById(Long id) {
        return festivalRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Festival with id " + id + " not found"));
    }

//    public Page<Festival> findFestivalsByName(String name, int page, int size, String sortBy) {
//        if (name == null || name.isBlank()) {
//            throw new BadRequestException("Search string must not be empty");
//        }
//        if (size > 50) size = 50;
//        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
//        return festivalRepository.findByNameStartingWithIgnoreCase(name, pageable);
//    }
//
//    public Page<Festival> findFestivalsByCity(String city, int page, int size, String sortBy) {
//        if (city == null || city.isBlank()) {
//            throw new BadRequestException("Search string must not be empty");
//        }
//        if (size > 50) size = 50;
//        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
//        return festivalRepository.findByCityStartingWithIgnoreCase(city, pageable);
//    }
//
//    public Page<Festival> findFestivalsByCountry(String country, int page, int size, String sortBy) {
//        if (country == null || country.isBlank()) {
//            throw new BadRequestException("Search string must not be empty");
//        }
//        if (size > 50) size = 50;
//        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
//        return festivalRepository.findByCountryStartingWithIgnoreCase(country, pageable);
//    }
//
//    public Page<Festival> findFestivalsByArtistsNames(String name, int page, int size, String sortBy) {
//        if (name == null || name.isBlank()) {
//            throw new BadRequestException("Search string must not be empty");
//        }
//        if (size > 50) size = 50;
//        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
//        return festivalRepository.findByArtists_NameStartingWithIgnoreCase(name, pageable);
//    }
//
//    public Page<Festival> findFestivalByArtistsGenre(Genre genre, int page, int size, String sortBy) {
//        if (size > 50) size = 50;
//        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
//        return festivalRepository.findByArtists_Genre(genre, pageable);
//    }
//

    public Page<Festival> searchFestivals(String festivalName, String city, String country,
                                          String artistName, Genre genre,
                                          LocalDate startDate, LocalDate endDate,
                                          int page, int size, String sortBy, String direction) {

        if (size > 50) size = 50;

        Specification<Festival> festivalNameSpec = (root, query, builder) ->
                festivalName == null ? null : builder.like(builder.lower(root.get("name")), "%" + festivalName.toLowerCase() + "%");

        Specification<Festival> citySpec = (root, query, builder) ->
                city == null ? null : builder.like(builder.lower(root.get("city")), "%" + city.toLowerCase() + "%");

        Specification<Festival> countrySpec = (root, query, builder) ->
                country == null ? null : builder.like(builder.lower(root.get("country")), "%" + country.toLowerCase() + "%");

        Specification<Festival> artistNameSpec = (root, query, builder) -> {
            query.distinct(true);
            return artistName == null ? null :
                    builder.like(
                            builder.lower(root.join("lineups").join("artist").get("name")),
                            "%" + artistName.toLowerCase() + "%"
                    );
        };

        Specification<Festival> genreSpec = (root, query, builder) ->
                genre == null ? null : builder.equal(root.join("lineups").join("artist").get("genre"), genre);

        Specification<Festival> dateSpec = (root, query, builder) -> {
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

        Specification<Festival> specification = Specification
                .where(festivalNameSpec)
                .and(citySpec)
                .and(countrySpec)
                .and(artistNameSpec)
                .and(genreSpec)
                .and(dateSpec);

        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return festivalRepository.findAll(specification, pageable);
    }

    public Festival updateFestival(Long id, FestivalUpdateDTO payload) {
        Festival festival = findFestivalById(id);

        if (payload.name() != null && !payload.name().isBlank()
                && !payload.name().equalsIgnoreCase(festival.getName())) {
            festivalRepository.findByNameIgnoreCase(payload.name())
                    .ifPresent(a -> {
                        throw new BadRequestException("A festival with name '" + payload.name() + "' already exists");
                    });
            festival.setName(payload.name());
        }

        if (payload.city() != null) festival.setCity(payload.city());

        if (payload.country() != null) festival.setCountry(payload.country());

        if (payload.startDate() != null) festival.setStartDate(payload.startDate());

        if (payload.endDate() != null) festival.setEndDate(payload.endDate());

        if (payload.startDate() != null && payload.endDate() != null && payload.startDate().isAfter(payload.endDate())) {
            throw new BadRequestException("Festival start date must be before end date");
        }

        LocalDate newStart = payload.startDate() != null ? payload.startDate() : festival.getStartDate();
        LocalDate newEnd = payload.endDate() != null ? payload.endDate() : festival.getEndDate();
        if (newStart.isAfter(newEnd)) {
            throw new BadRequestException("Start date must be before end date");
        }

        if (payload.maxNumbPartecipants() != null) festival.setMaxNumbPartecipants(payload.maxNumbPartecipants());

        if (payload.dailyPrice() != null) festival.setDailyPrice(payload.dailyPrice());

        if (payload.coverImg() != null && !payload.coverImg().isEmpty()) {
            String coverUrl = cloudinaryService.uploadFile(payload.coverImg());
            festival.setCoverImg(coverUrl);
        }

        Festival updated = festivalRepository.save(festival);
        log.info("The festival " + updated.getId() + " has been updated");

        return updated;
    }

    @Transactional
    public void updateFestivalCampingMap(Long festivalId, MultipartFile campingMap, Map<UnitType, Double> pricesByUnitType) throws IOException {

        Festival festival = festivalRepository.findById(festivalId)
                .orElseThrow(() -> new NotFoundException("Festival not found"));

        if (campingMap == null || campingMap.isEmpty())
            throw new BadRequestException("Camping map file is empty");

        String campingMapUrl = cloudinaryService.uploadFile(campingMap);
        festival.setCampingMap(campingMapUrl);
        festivalRepository.save(festival);

        String campingMapSvg = new String(campingMap.getBytes(), StandardCharsets.UTF_8);

        createCampingAndUnits(festival, campingMapSvg, pricesByUnitType);

        log.info("Camping map and prices updated for festival " + festival.getName());
    }

    @Transactional
    public void deleteFestivalById(Long id) {
        Festival festival = findFestivalById(id);

        Optional<Camping> campingOpt = campingRepository.findByFestival(festival);
        if (campingOpt.isPresent()) {
            Camping camping = campingOpt.get();

            List<AccomodationType> types = accomodationTypeRepository.findByCamping(camping);

            for (AccomodationType type : types) {
                campingUnitRepository.deleteByAccomodationType(type);
            }

            accomodationTypeRepository.deleteByCamping(camping);

            campingRepository.delete(camping);
        }

        festivalRepository.delete(festival);

        log.info("Festival " + festival.getId() + " has been deleted");
    }

}
