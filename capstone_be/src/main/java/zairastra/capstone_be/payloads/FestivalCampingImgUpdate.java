package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.NotBlank;

public record FestivalCampingImgUpdate(
        @NotBlank(message = "Camping map is required")
        String campingMap
) {
}
