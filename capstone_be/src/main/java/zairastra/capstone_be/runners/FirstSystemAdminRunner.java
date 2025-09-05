package zairastra.capstone_be.runners;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import zairastra.capstone_be.entities.enums.Role;
import zairastra.capstone_be.payloads.AdminRegistrationDTO;
import zairastra.capstone_be.services.AdminService;

@Component
public class FirstSystemAdminRunner implements CommandLineRunner {

    @Autowired
    private AdminService adminService;

    @Override
    public void run(String... args) throws Exception {

        AdminRegistrationDTO payload = new AdminRegistrationDTO(
                "boss",
                "Robin",
                "Scherbatsky",
                "boss.scherbatsky@festimate.com",
                "password1",
                Role.SYSTEM_ADMIN,
                "58462938103",
                "https://ui-avatars.com/api/?name=Robin+Scherbatsky"
        );

        boolean exists = adminService.adminExistsByUsernameOrEmail(payload.username(), payload.email());

        if (!exists) {
            adminService.createAdmin(payload);
            System.out.println("The Admin Boss has been successfully created");
        } else {
            System.out.println("The AdminBoss already exists in our system");
        }
    }
}

