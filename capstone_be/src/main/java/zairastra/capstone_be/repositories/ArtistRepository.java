package zairastra.capstone_be.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import zairastra.capstone_be.entities.Artist;
import zairastra.capstone_be.entities.enums.Genre;

import java.util.List;
import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

    Optional<Artist> findByNameIgnoreCase(String name);

    List<Artist> findByNameContainingIgnoreCase(String name);

    List<Artist> findByGenre(Genre genre);
}
