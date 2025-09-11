package zairastra.capstone_be.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zairastra.capstone_be.entities.AccomodationType;
import zairastra.capstone_be.entities.Camping;

import java.util.List;

@Repository
public interface AccomodationTypeRepository extends JpaRepository<AccomodationType, Long> {

    List<AccomodationType> findByCamping(Camping camping);

    void deleteByCamping(Camping camping);
}
