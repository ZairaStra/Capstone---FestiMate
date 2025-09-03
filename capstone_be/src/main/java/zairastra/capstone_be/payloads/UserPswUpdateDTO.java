package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record UserPswUpdateDTO(
        @NotEmpty(message = "Old password is required")
        String oldPassword,
        @NotEmpty(message = "New password is required")
        @Size(min = 8, message = "Password must be at least 8 characters") String newPassword
) {
}
