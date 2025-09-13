package zairastra.capstone_be.payloads;

import org.springframework.web.multipart.MultipartFile;
import zairastra.capstone_be.entities.enums.Genre;

public record ArtistUpdateDTO(
        String name,
        Genre genre,
        MultipartFile coverImg,
        String link
) {
}
