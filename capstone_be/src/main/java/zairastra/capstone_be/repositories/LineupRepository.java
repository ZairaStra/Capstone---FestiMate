package zairastra.capstone_be.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zairastra.capstone_be.entities.Artist;
import zairastra.capstone_be.entities.Festival;
import zairastra.capstone_be.entities.Lineup;

import java.time.LocalDate;
import java.time.LocalTime;

@Repository
public interface LineupRepository extends JpaRepository<Lineup, Long> {

    Page<Lineup> findByFestival(Festival festival, Pageable pageable);

    Page<Lineup> findByArtist(Artist artist, Pageable pageable);

    boolean existsByFestival(Festival festival);

    boolean existsByArtistAndDateAndStartTime(
            Artist artist,
            LocalDate date,
            LocalTime startTime
    );
}
