package zairastra.capstone_be.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import zairastra.capstone_be.entities.CampingUnit;
import zairastra.capstone_be.entities.Festival;
import zairastra.capstone_be.entities.PublicUser;
import zairastra.capstone_be.entities.Reservation;

import java.time.LocalDate;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long>, JpaSpecificationExecutor<Reservation> {

    Page<Reservation> findByFestival(Festival festival, Pageable pageable);

    Page<Reservation> findByCampingUnits(CampingUnit campingUnit, Pageable pageable);

    Page<Reservation> findByUser(PublicUser user, Pageable pageable);

    @Query("SELECT COALESCE(SUM(r.numTickets), 0) FROM Reservation r WHERE r.festival = :festival")
    int countTotalTicketsByFestival(@Param("festival") Festival festival);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END " +
            "FROM Reservation r JOIN r.campingUnits cu " +
            "WHERE cu = :unit " +
            "AND r.startDate <= :endDate AND r.endDate >= :startDate")
    boolean existsReservationForCampingUnitAndDates(
            @Param("unit") CampingUnit unit,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
