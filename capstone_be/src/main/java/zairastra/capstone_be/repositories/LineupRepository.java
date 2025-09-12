package zairastra.capstone_be.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zairastra.capstone_be.entities.Artist;
import zairastra.capstone_be.entities.Festival;
import zairastra.capstone_be.entities.Lineup;

import java.util.List;

@Repository
public interface LineupRepository extends JpaRepository<Lineup, Long> {

    List<Lineup> findByFestival(Festival festival);
    
    List<Lineup> findByArtist(Artist artist);
}
