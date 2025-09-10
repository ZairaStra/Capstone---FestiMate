package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

public record FestivalCampingMapUpdateDTO(
        @NotNull(message = "Camping map file is required")
        MultipartFile campingMap
) {
}
