package zairastra.capstone_be.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import zairastra.capstone_be.entities.Admin;
import zairastra.capstone_be.entities.enums.Department;
import zairastra.capstone_be.exceptions.ValidationException;
import zairastra.capstone_be.payloads.AdminRegistrationDTO;
import zairastra.capstone_be.payloads.AdminUpdateDTO;
import zairastra.capstone_be.payloads.UserRegistrationResponseDTO;
import zairastra.capstone_be.services.AdminService;

import java.util.List;

@RestController
@RequestMapping("/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public UserRegistrationResponseDTO createAdmin(@RequestBody AdminRegistrationDTO payload, BindingResult validationResult) {

        if (validationResult.hasErrors()) {
            List<String> errors = validationResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage())
                    .toList();
            throw new ValidationException(errors);
        }

        Admin newAdmin = adminService.createAdmin(payload);

        return new UserRegistrationResponseDTO(newAdmin.getId());
    }


    @GetMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public Page<Admin> findAllAdmins(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size,
                                     @RequestParam(defaultValue = "id") String sortBy) {
        return adminService.findAllAdmins(page, size, sortBy);
    }

    @GetMapping("/{adminId}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public Admin findAdminById(@PathVariable Long adminId) {
        return adminService.findAdminById(adminId);
    }

    @GetMapping("/by-email/{email}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public Admin findAdminByEmail(@PathVariable String email) {
        return adminService.findAdminByEmail(email);
    }

    //TODO: passare a Page
    @GetMapping("/by-department/{department}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public List<Admin> findAdminsByDepartment(@PathVariable Department department) {
        return adminService.findAdminsByDepartment(department);
    }

    @PutMapping("/{adminId}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public Admin updateAdmin(@PathVariable Long adminId, @RequestBody @Validated AdminUpdateDTO payload, BindingResult validationResult) {

        if (validationResult.hasErrors()) {
            List<String> errors = validationResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage())
                    .toList();
            throw new ValidationException(errors);
        }

        return adminService.updateAdmin(adminId, payload);
    }

    @DeleteMapping("/{adminId}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAdminById(@PathVariable Long adminId) {
        adminService.deleteAdminById(adminId);
    }
}
