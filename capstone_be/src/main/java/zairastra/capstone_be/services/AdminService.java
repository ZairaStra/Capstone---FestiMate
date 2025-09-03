package zairastra.capstone_be.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import zairastra.capstone_be.entities.Admin;
import zairastra.capstone_be.entities.enums.Department;
import zairastra.capstone_be.entities.enums.Role;
import zairastra.capstone_be.exceptions.BadRequestException;
import zairastra.capstone_be.exceptions.NotFoundException;
import zairastra.capstone_be.payloads.AdminRegistrationDTO;
import zairastra.capstone_be.payloads.AdminUpdateDTO;
import zairastra.capstone_be.payloads.UserRegistrationResponseDTO;
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

    public UserRegistrationResponseDTO createAdmin(AdminRegistrationDTO payload) {
        adminRepository.findByEmailIgnoreCase(payload.email()).ifPresent(admin -> {
            throw new BadRequestException("An admin with email " + payload.email() + " already exists in our system");
        });
        adminRepository.findByUsernameIgnoreCase(payload.username()).ifPresent(admin -> {
            throw new BadRequestException("An admin with username " + payload.username() + " already exists in our system");
        });

        Admin newAdmin = new Admin(
                payload.username(),
                payload.name(),
                payload.surname(),
                payload.email(),
                bCrypt.encode(payload.password()),
                payload.profileImg(),
                payload.phoneNumber(),
                payload.role(),
                payload.department()
        );

        newAdmin.setHireDate(LocalDate.now());

        Admin savedAdmin = adminRepository.save(newAdmin);
        log.info("The admin " + payload.name() + " " + payload.surname() + " has been saved");

        return new UserRegistrationResponseDTO(savedAdmin.getId());
    }

    public List<Admin> findAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin findAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Admin with id " + id + " not found"));
    }

    public Admin findAdminByUsername(String username) {
        return adminRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new NotFoundException("Admin with username " + username + " not found"));
    }

    public Admin findAdminByEmail(String email) {
        return adminRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("Admin with email " + email + " not found"));
    }

    public List<Admin> findAdminsByRole(Role role) {
        return adminRepository.findByRole(role);
    }

    public List<Admin> findAdminsByDepartment(Department department) {
        return adminRepository.findByDepartment(department);
    }

    public List<Admin> findAdminsByRoleAndDepartment(Role role, Department department) {
        return adminRepository.findByRoleAndDepartment(role, department);
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

        Admin admin = findAdminById(id);
        admin.setUsername(payload.username());
        admin.setName(payload.name());
        admin.setSurname(payload.surname());
        admin.setEmail(payload.email());
        admin.setProfileImg(payload.profileImg());
        admin.setPhoneNumber(payload.phoneNumber());
        admin.setRole(payload.role());
        admin.setDepartment(payload.department());

        return adminRepository.save(admin);
    }

    public void deleteAdminById(Long id) {
        Admin admin = findAdminById(id);
        adminRepository.delete(admin);
    }
}
