package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record LoginDTO(
        @Email(message = "Insert a valid Email")
        @NotEmpty(message = "Email is required")
        String username,
        @NotEmpty(message = "Password is required")
        String password
) {
}
