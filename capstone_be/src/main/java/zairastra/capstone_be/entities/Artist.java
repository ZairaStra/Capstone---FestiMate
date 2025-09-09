package zairastra.capstone_be.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import zairastra.capstone_be.entities.enums.Genre;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "artists")

public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "artist_id", nullable = false)
    private Long id;

    @NotBlank(message = "Artist name is required")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Genre genre;

    @Column(name = "cover_img")
    private String coverImg;

    private String link;

    public Artist(String name, Genre genre, String coverImg, String link) {
        this.name = name;
        this.genre = genre;
        this.coverImg = coverImg;
        this.link = link;
    }
}
