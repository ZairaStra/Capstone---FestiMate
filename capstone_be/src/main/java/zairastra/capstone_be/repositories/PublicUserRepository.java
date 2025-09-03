package zairastra.capstone_be.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zairastra.capstone_be.entities.PublicUser;

import java.util.Optional;

@Repository
public interface PublicUserRepository extends JpaRepository<PublicUser, Long> {

    Optional<PublicUser> findByUsernameIgnoreCase(String username);

    Optional<PublicUser> findByEmailIgnoreCase(String email);

}
