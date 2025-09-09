package zairastra.capstone_be.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import zairastra.capstone_be.entities.Artist;
import zairastra.capstone_be.entities.enums.Genre;
import zairastra.capstone_be.exceptions.ValidationException;
import zairastra.capstone_be.payloads.ArtistRegistrationDTO;
import zairastra.capstone_be.payloads.ArtistRegistrationResponseDTO;
import zairastra.capstone_be.payloads.ArtistUpdateDTO;
import zairastra.capstone_be.services.ArtistService;

import java.util.List;

@RestController
@RequestMapping("/artists")
public class ArtistController {

    @Autowired
    private ArtistService artistService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ARTIST_MANAGER')")
    @ResponseStatus(HttpStatus.CREATED)
    public ArtistRegistrationResponseDTO createArtist(@RequestBody @Validated ArtistRegistrationDTO payload, BindingResult validationResult) {

        if (validationResult.hasErrors()) {
            List<String> errors = validationResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage())
                    .toList();
            throw new ValidationException(errors);
        }

        Artist savedArtist = artistService.createArtist(payload);
        return new ArtistRegistrationResponseDTO(savedArtist.getId());
    }

    @GetMapping
    @PreAuthorize("hasRole('ARTIST_MANAGER')")
    @ResponseStatus(HttpStatus.OK)
    public Page<Artist> findAllArtists(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size,
                                       @RequestParam(defaultValue = "id") String sortBy) {
        return artistService.findAllArtists(page, size, sortBy);
    }

    @GetMapping("/{artistId}")
    @PreAuthorize("hasRole('ARTIST_MANAGER')")
    @ResponseStatus(HttpStatus.OK)
    public Artist findArtistById(@PathVariable Long artistId) {
        return artistService.findArtistById(artistId);
    }

    @GetMapping("/containing-name/{name}")
    @PreAuthorize("hasRole('ARTIST_MANAGER')")
    @ResponseStatus(HttpStatus.OK)
    public Page<Artist> findArtistByName(@PathVariable String name,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "10") int size,
                                         @RequestParam(defaultValue = "id") String sortBy) {
        return artistService.findArtistsByName(name, page, size, sortBy);
    }

    @GetMapping("/by-genre/{genre}")
    @PreAuthorize("hasRole('ARTIST_MANAGER')")
    @ResponseStatus(HttpStatus.OK)
    public Page<Artist> findArtistByGenre(@PathVariable Genre genre,
                                          @RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "10") int size,
                                          @RequestParam(defaultValue = "id") String sortBy) {
        return artistService.findArtistsByGenre(genre, page, size, sortBy);
    }

    @PutMapping("/{artistId}")
    @PreAuthorize("hasRole('ARTIST_MANAGER')")
    @ResponseStatus(HttpStatus.OK)
    public Artist updateArtist(@PathVariable Long artistId, @RequestBody ArtistUpdateDTO payload) {
        return artistService.updateArtist(artistId, payload);
    }

    @DeleteMapping("/{artistId}")
    @PreAuthorize("hasRole('ARTIST_MANAGER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteArtistById(@PathVariable Long artistId) {
        artistService.deleteArtistById(artistId);
    }

}
