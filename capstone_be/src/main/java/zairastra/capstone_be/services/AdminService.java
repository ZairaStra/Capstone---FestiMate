package zairastra.capstone_be.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import zairastra.capstone_be.entities.Admin;
import zairastra.capstone_be.entities.enums.Department;
import zairastra.capstone_be.entities.enums.Role;
import zairastra.capstone_be.exceptions.BadRequestException;
import zairastra.capstone_be.exceptions.NotFoundException;
import zairastra.capstone_be.payloads.AdminRegistrationDTO;
import zairastra.capstone_be.payloads.AdminResponseDTO;
import zairastra.capstone_be.payloads.AdminUpdateDTO;
import zairastra.capstone_be.repositories.AdminRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder bCrypt;

    @Autowired
    private UserService userService;

    public Admin createAdmin(AdminRegistrationDTO payload) {
        adminRepository.findByEmailIgnoreCase(payload.email()).ifPresent(admin -> {
            throw new BadRequestException("An admin with email " + payload.email() + " already exists in our system");
        });
        adminRepository.findByUsernameIgnoreCase(payload.username()).ifPresent(admin -> {
            throw new BadRequestException("An admin with username " + payload.username() + " already exists in our system");
        });

        Department assignedDepartment = null;

        if (payload.role() == Role.SYSTEM_ADMIN) {
            assignedDepartment = Department.HR;
        } else if (payload.role() == Role.ARTIST_MANAGER) {
            assignedDepartment = Department.ARTIST_MANAGEMENT;
        } else if (payload.role() == Role.FESTIVAL_MANAGER) {
            assignedDepartment = Department.FESTIVAL_MANAGEMENT;
        } else if (payload.role() == Role.RESERVATION_MANAGER) {
            assignedDepartment = Department.RESERVATION_MANAGEMENT;
        } else if (payload.role() == Role.USER_MANAGER) {
            assignedDepartment = Department.USERS_MANAGEMENT;
        }


        Admin newAdmin = new Admin(
                payload.username(),
                payload.name(),
                payload.surname(),
                payload.email(),
                bCrypt.encode(payload.password()),
                payload.phoneNumber(),
                payload.role(),
                assignedDepartment
        );

        newAdmin.setHireDate(LocalDate.now());

        Admin savedAdmin = adminRepository.save(newAdmin);
        log.info("The admin " + payload.name() + " " + payload.surname() + " has been saved");

        userService.sendRegistrationEmail(savedAdmin);

        return savedAdmin;
    }

    public Page<Admin> findAllAdmins(int page, int size, String sortBy) {
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return adminRepository.findAll(pageable);
    }

    public Admin findAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Admin with id " + id + " not found"));
    }

    public Admin findAdminByEmail(String email) {
        return adminRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("Admin with email " + email + " not found"));
    }

    public List<Admin> findAdminsByRole(Role role) {
        return adminRepository.findByRole(role);
    }

    public Page<Admin> findAdminsByDepartment(Department department, int page, int size, String sortBy) {

        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());

        return adminRepository.findByDepartment(department, pageable);
    }

    public Admin updateAdmin(Long id, AdminUpdateDTO payload) {

        adminRepository.findByUsernameIgnoreCase(payload.username())
                .filter(existingAdmin -> !existingAdmin.getId().equals(id))
                .ifPresent(existingAdmin -> {
                    throw new BadRequestException("An admin with username " + payload.username() + " already exists in our system");
                });

        adminRepository.findByEmailIgnoreCase(payload.email())
                .filter(existingAdmin -> !existingAdmin.getId().equals(id))
                .ifPresent(existingAdmin -> {
                    throw new BadRequestException("An admin with email " + payload.email() + " already exists in our system");
                });

        Department assignedDepartment = null;

        if (payload.role() == Role.SYSTEM_ADMIN) {
            assignedDepartment = Department.HR;
        } else if (payload.role() == Role.ARTIST_MANAGER) {
            assignedDepartment = Department.ARTIST_MANAGEMENT;
        } else if (payload.role() == Role.FESTIVAL_MANAGER) {
            assignedDepartment = Department.FESTIVAL_MANAGEMENT;
        } else if (payload.role() == Role.RESERVATION_MANAGER) {
            assignedDepartment = Department.RESERVATION_MANAGEMENT;
        } else if (payload.role() == Role.USER_MANAGER) {
            assignedDepartment = Department.USERS_MANAGEMENT;
        }

        Admin admin = findAdminById(id);
        admin.setUsername(payload.username());
        admin.setName(payload.name());
        admin.setSurname(payload.surname());
        admin.setEmail(payload.email());
        admin.setProfileImg(payload.profileImg());
        admin.setPhoneNumber(payload.phoneNumber());
        admin.setRole(payload.role());
        admin.setDepartment(assignedDepartment);

        Admin updatedAdmin = adminRepository.save(admin);

        log.info("Admin " + admin.getId() + " has been updated");

        return updatedAdmin;
    }

    public void deleteAdminById(Long id) {
        Admin admin = findAdminById(id);
        adminRepository.delete(admin);

        log.info("Admin " + admin.getId() + " has been deleted");
    }

    public boolean adminExistsByUsernameOrEmail(String username, String email) {
        return adminRepository.existsByUsername(username) || adminRepository.existsByEmail(email);
    }

    public AdminResponseDTO getMyProfile(Admin admin) {
        return new AdminResponseDTO(
                admin.getUsername(),
                admin.getName(),
                admin.getSurname(),
                admin.getEmail(),
                admin.getProfileImg(),
                admin.getPhoneNumber(),
                admin.getRole(),
                admin.getDepartment(),
                admin.getHireDate()
        );
    }

}
