package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import zairastra.capstone_be.entities.enums.Genre;

public record ArtistRegistrationDTO(
        @NotBlank(message = "Artist name is required")
        String name,

        @NotNull(message = "Genre is required")
        Genre genre,

        String coverImg,

        String link
) {
}
