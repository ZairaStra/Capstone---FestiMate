package zairastra.capstone_be.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zairastra.capstone_be.entities.AccomodationType;

@Repository
public interface AccomodationTypeRepository extends JpaRepository<AccomodationType, Long> {
}
