package zairastra.capstone_be.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import zairastra.capstone_be.entities.Festival;

import java.util.Optional;

public interface FestivalRepository extends JpaRepository<Festival, Long>, JpaSpecificationExecutor<Festival> {

    boolean existsByName(String name);

    Optional<Festival> findByNameIgnoreCase(String name);

//    Page<Festival> findByNameStartingWithIgnoreCase(String name, Pageable pageable);
//
//    Page<Festival> findByCityStartingWithIgnoreCase(String city, Pageable pageable);
//
//    Page<Festival> findByCountryStartingWithIgnoreCase(String country, Pageable pageable);
//
//    Page<Festival> findByArtists_NameStartingWithIgnoreCase(String prefix, Pageable pageable);
//
//    Page<Festival> findByArtists_Genre(Genre genre, Pageable pageable);
//
//    Page<Festival> findByStartDateBetween(LocalDate start, LocalDate end, Pageable pageable);
//
//    Page<Festival> findByEndDateBetween(LocalDate start, LocalDate end, Pageable pageable);

    @Query("SELECT f FROM PublicUser u JOIN u.wishlist f WHERE u.id = :userId")
    Page<Festival> findWishlistByUserId(Long userId, Pageable pageable);
}

