package zairastra.capstone_be.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zairastra.capstone_be.entities.CampingUnit;
import zairastra.capstone_be.entities.Festival;
import zairastra.capstone_be.entities.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Page<Reservation> findByFestival(Festival festival, Pageable pageable);

    Page<Reservation> findByCampingUnits(CampingUnit campingUnit, Pageable pageable);

}
