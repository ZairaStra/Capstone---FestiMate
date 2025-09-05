package zairastra.capstone_be.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zairastra.capstone_be.entities.Admin;
import zairastra.capstone_be.entities.enums.Department;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByUsernameIgnoreCase(String username);

    Optional<Admin> findByEmailIgnoreCase(String email);

    List<Admin> findByDepartment(Department department);
}
