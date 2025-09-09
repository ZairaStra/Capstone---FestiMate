package zairastra.capstone_be.payloads;

import zairastra.capstone_be.entities.enums.Genre;

public record ArtistUpdateDTO(
        String name,
        Genre genre,
        String coverImg,
        String link
) {
}
