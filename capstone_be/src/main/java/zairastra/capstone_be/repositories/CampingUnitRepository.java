package zairastra.capstone_be.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zairastra.capstone_be.entities.AccomodationType;
import zairastra.capstone_be.entities.CampingUnit;


@Repository
public interface CampingUnitRepository extends JpaRepository<CampingUnit, Long> {

    Page<CampingUnit> findByAccomodationType(AccomodationType accomodationType, Pageable pageable);

    long countByAccomodationType(AccomodationType accomodationType);

    void deleteByAccomodationType(AccomodationType accomodationType);
}
