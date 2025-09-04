package zairastra.capstone_be.runners;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import zairastra.capstone_be.entities.Admin;
import zairastra.capstone_be.entities.enums.Department;
import zairastra.capstone_be.entities.enums.Role;
import zairastra.capstone_be.payloads.AdminRegistrationDTO;
import zairastra.capstone_be.services.AdminService;

import java.util.Optional;

@Component
public class FirstSystemAdminRunner implements CommandLineRunner {

    @Autowired
    private AdminService adminService;

    @Override
    public void run(String... args) throws Exception {

        Optional<Admin> firstAdmin = adminService.findAdminsByRole(Role.SYSTEM_ADMIN).stream().findFirst();

        if (firstAdmin.isEmpty()) {
            AdminRegistrationDTO payload = new AdminRegistrationDTO(
                    "boss",
                    "Barney",
                    "Stinson",
                    "boss.stinson@festimate.com",
                    "password",
                    Role.SYSTEM_ADMIN,
                    Department.HR,
                    "48462938103",
                    "https://ui-avatars.com/api/?name=Barney+Stinson"
            );

            adminService.createAdmin(payload);
            System.out.println("The Admin Boss has been successfully created");
        } else {
            System.out.println("The AdminBoss already exists in our system");
        }
    }
}