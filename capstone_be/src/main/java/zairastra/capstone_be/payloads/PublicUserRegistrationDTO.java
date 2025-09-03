package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record PublicUserRegistrationDTO(
        @NotEmpty(message = "Username is required")
        String username,

        @NotEmpty(message = "Name is required")
        String name,

        @NotEmpty(message = "Surname is required")
        String surname,

        @Email(message = "Insert a valid Email")
        @NotEmpty(message = "Email is required")
        String email,

        @NotEmpty(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        @NotEmpty(message = "City is required")
        String city,

        @NotEmpty(message = "Country is required")
        String country,

        String profileImg
) {
}
