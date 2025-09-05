package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import zairastra.capstone_be.entities.enums.Role;

public record AdminUpdateDTO(
        @NotEmpty(message = "Username is required")
        String username,

        @NotEmpty(message = "Name is required")
        String name,

        @NotEmpty(message = "Surname is required")
        String surname,

        @Email(message = "Insert a valid Email")
        @NotEmpty(message = "Email is required")
        String email,

        @NotEmpty(message = "Role is required")
        Role role,

        @NotEmpty(message = "Phone number is required")
        String phoneNumber,

        String profileImg
) {
}
