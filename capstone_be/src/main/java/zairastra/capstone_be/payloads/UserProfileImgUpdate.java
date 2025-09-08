package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

public record UserProfileImgUpdate(
        @NotNull(message = "New profile image is required")
        MultipartFile profileImg
) {
}
