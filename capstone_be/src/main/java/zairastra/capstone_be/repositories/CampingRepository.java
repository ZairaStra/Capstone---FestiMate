package zairastra.capstone_be.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zairastra.capstone_be.entities.Camping;
import zairastra.capstone_be.entities.Festival;

import java.util.Optional;

@Repository
public interface CampingRepository extends JpaRepository<Camping, Long> {

    Optional<Camping> findByFestival(Festival festival);

    void deleteByFestival(Festival festival);

}
