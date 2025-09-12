package zairastra.capstone_be.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import zairastra.capstone_be.entities.Lineup;
import zairastra.capstone_be.exceptions.ValidationException;
import zairastra.capstone_be.payloads.LineupRegistrationDTO;
import zairastra.capstone_be.payloads.LineupRegistrationResponseDTO;
import zairastra.capstone_be.payloads.LineupUpdateDTO;
import zairastra.capstone_be.services.LineupService;

import java.util.List;

@RestController
@RequestMapping("/lineups")
public class LineupController {

    @Autowired
    private LineupService lineupService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('FESTIVAL_MANAGER')")
    @ResponseStatus(HttpStatus.CREATED)
    public LineupRegistrationResponseDTO createLineup(@RequestBody @Validated LineupRegistrationDTO payload, BindingResult validationResult) {

        if (validationResult.hasErrors()) {
            List<String> errors = validationResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage())
                    .toList();
            throw new ValidationException(errors);
        }

        Lineup savedLineup = lineupService.createLineup(payload);
        return new LineupRegistrationResponseDTO(savedLineup.getId());
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<Lineup> findAllLineups(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size,
                                       @RequestParam(defaultValue = "id") String sortBy) {

        return lineupService.findAllLineups(page, size, sortBy);
    }

    @GetMapping("/{lineupId}")
    @ResponseStatus(HttpStatus.OK)
    public Lineup findLineupById(@PathVariable Long lineupId) {
        return lineupService.findLineupById(lineupId);
    }

    @GetMapping("/festival/{festivalId}")
    @ResponseStatus(HttpStatus.OK)
    public Lineup findByFestival(@PathVariable Long festivalId) {
        return lineupService.findByFestival(festivalId);
    }

    @GetMapping("/artist/{artistId}")
    @ResponseStatus(HttpStatus.OK)
    public Page<Lineup> findByArtist(@PathVariable Long artistId,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size,
                                     @RequestParam(defaultValue = "id") String sortBy) {

        return lineupService.findByArtist(artistId, page, size, sortBy);
    }

    @PutMapping("/{lineupId}")
    @PreAuthorize("hasRole('FESTIVAL_MANAGER')")
    @ResponseStatus(HttpStatus.OK)
    public Lineup updateLineup(@PathVariable Long lineupId,
                               @RequestBody @Validated LineupUpdateDTO payload, BindingResult validationResult) {

        if (validationResult.hasErrors()) {
            List<String> errors = validationResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage())
                    .toList();
            throw new ValidationException(errors);
        }

        return lineupService.updateLineup(lineupId, payload);
    }

    @DeleteMapping("/{lineupId}")
    @PreAuthorize("hasRole('FESTIVAL_MANAGER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLineup(@PathVariable Long lineupId) {
        lineupService.deleteLineupById(lineupId);
    }
}
