package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.NotEmpty;

public record UserProfileImgUpdate(
        @NotEmpty(message = "New profile image is required")
        String profileImg
) {
}
