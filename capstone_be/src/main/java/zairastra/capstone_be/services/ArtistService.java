package zairastra.capstone_be.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import zairastra.capstone_be.entities.Artist;
import zairastra.capstone_be.entities.enums.Genre;
import zairastra.capstone_be.exceptions.BadRequestException;
import zairastra.capstone_be.exceptions.NotFoundException;
import zairastra.capstone_be.payloads.ArtistRegistrationDTO;
import zairastra.capstone_be.payloads.ArtistUpdateDTO;
import zairastra.capstone_be.repositories.ArtistRepository;

@Service
@Slf4j
public class ArtistService {

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public Artist createArtist(ArtistRegistrationDTO payload) {
        artistRepository.findByNameIgnoreCase(payload.name()).ifPresent(artist -> {
            throw new BadRequestException("The artist " + payload.name() + " already exists in our system");
        });

        String coverUrl = "https://default-cover-image.com/default.png";
        if (payload.coverImg() != null && !payload.coverImg().isEmpty()) {
            coverUrl = cloudinaryService.uploadFile(payload.coverImg());
        }

        Artist newArtist = new Artist(
                payload.name(),
                payload.genre(),
                coverUrl,
                payload.link()
        );

        Artist savedArtist = artistRepository.save(newArtist);
        log.info("The artist " + payload.name() + " has been saved");


        return savedArtist;
    }

    public Page<Artist> findAllArtists(int page, int size, String sortBy) {
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return artistRepository.findAll(pageable);
    }

    public Artist findArtistById(Long id) {
        return artistRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Artist with id " + id + " not found"));
    }

    public Page<Artist> findArtistsByName(String name, int page, int size, String sortBy) {
        if (name == null || name.isBlank()) {
            throw new BadRequestException("Search string must not be empty");
        }
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return artistRepository.findByNameStartingWithIgnoreCase(name, pageable);
    }

    public Page<Artist> findArtistsByGenre(Genre genre, int page, int size, String sortBy) {
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return artistRepository.findByGenre(genre, pageable);
    }

    public Artist updateArtist(Long id, ArtistUpdateDTO payload) {
        Artist artist = findArtistById(id);

        if (payload.name() != null && !payload.name().isBlank()
                && !payload.name().equalsIgnoreCase(artist.getName())) {
            artistRepository.findByNameIgnoreCase(payload.name())
                    .ifPresent(a -> {
                        throw new BadRequestException("An artist with the name '" + payload.name() + "' already exists");
                    });
            artist.setName(payload.name());
        }

        if (payload.genre() != null) artist.setGenre(payload.genre());


        if (payload.coverImg() != null && !payload.coverImg().isEmpty()) {
            String coverUrl = cloudinaryService.uploadFile(payload.coverImg());
            artist.setCoverImg(coverUrl);
        }

        if (payload.link() != null) {
            artist.setLink(payload.link());
        }

        Artist updated = artistRepository.save(artist);
        log.info("The artist " + updated.getId() + " has been updated");

        return updated;
    }

    public void deleteArtistById(Long id) {
        Artist artist = findArtistById(id);
        artistRepository.delete(artist);

        log.info("Artist " + artist.getId() + " has been deleted");
    }

}
