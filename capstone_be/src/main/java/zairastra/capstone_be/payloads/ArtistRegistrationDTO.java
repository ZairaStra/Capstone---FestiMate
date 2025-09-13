package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;
import zairastra.capstone_be.entities.enums.Genre;

public record ArtistRegistrationDTO(
        @NotEmpty(message = "Artist name is required")
        String name,

        @NotNull(message = "Genre is required")
        Genre genre,

        MultipartFile coverImg,

        String link
) {
}
