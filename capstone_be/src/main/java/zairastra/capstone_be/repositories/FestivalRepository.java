package zairastra.capstone_be.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import zairastra.capstone_be.entities.Festival;

import java.time.LocalDate;
import java.util.Optional;

public interface FestivalRepository extends JpaRepository<Festival, Long>, JpaSpecificationExecutor<Festival> {

    Optional<Festival> findByNameIgnoreCase(String name);

    Page<Festival> findByNameStartingWithIgnoreCase(String name, Pageable pageable);

    Page<Festival> findByGenre(String genre, Pageable pageable);

    Page<Festival> findByDateBetween(LocalDate start, LocalDate end, Pageable pageable);

    Page<Festival> findByArtists_NameStartingWithIgnoreCase(String prefix, Pageable pageable);
}
