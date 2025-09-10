package zairastra.capstone_be.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zairastra.capstone_be.entities.CampingUnit;

@Repository
public interface CampingUnitRepository extends JpaRepository<CampingUnit, Long> {
}
