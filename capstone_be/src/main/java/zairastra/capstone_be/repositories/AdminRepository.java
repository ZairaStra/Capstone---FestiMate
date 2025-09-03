package zairastra.capstone_be.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zairastra.capstone_be.entities.Admin;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByUsername(String username);

    Optional<Admin> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<Admin> findByRole(String role);

    List<Admin> findByDepartment(String department);

    List<Admin> findByRoleAndDepartment(String role, String department);
}
