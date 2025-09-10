package zairastra.capstone_be.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import zairastra.capstone_be.entities.Admin;
import zairastra.capstone_be.entities.Festival;
import zairastra.capstone_be.entities.enums.Genre;
import zairastra.capstone_be.entities.enums.UnitType;
import zairastra.capstone_be.exceptions.ValidationException;
import zairastra.capstone_be.payloads.FestivalCampingMapUpdateDTO;
import zairastra.capstone_be.payloads.FestivalRegistrationDTO;
import zairastra.capstone_be.payloads.FestivalRegistrationResponseDTO;
import zairastra.capstone_be.payloads.FestivalUpdateDTO;
import zairastra.capstone_be.services.FestivalService;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/festivals")
public class FestivalController {

    @Autowired
    private FestivalService festivalService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('FESTIVAL_MANAGER')")
    @ResponseStatus(HttpStatus.CREATED)
    public FestivalRegistrationResponseDTO createFestival(@RequestBody @Validated FestivalRegistrationDTO payload, BindingResult validationResult, @AuthenticationPrincipal Admin admin) throws IOException {

        if (validationResult.hasErrors()) {
            List<String> errors = validationResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage())
                    .toList();
            throw new ValidationException(errors);
        }

        Festival savedFestival = festivalService.createFestival(payload, admin);
        return new FestivalRegistrationResponseDTO(savedFestival.getId());
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<Festival> findAllFestivals(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "10") int size,
                                           @RequestParam(defaultValue = "id") String sortBy) {
        return festivalService.findAllFestivals(page, size, sortBy);
    }

    @GetMapping("/{festivalId}")
    @ResponseStatus(HttpStatus.OK)
    public Festival findFestivalById(@PathVariable Long festivalId) {
        return festivalService.findFestivalById(festivalId);
    }

    @GetMapping("/search")
    @ResponseStatus(HttpStatus.OK)
    public Page<Festival> searchFestivals(
            @RequestParam String festivalName,
            @RequestParam String city,
            @RequestParam String country,
            @RequestParam String artistName,
            @RequestParam Genre genre,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        return festivalService.searchFestivals(festivalName, city, country, artistName, genre, startDate, endDate, page, size, sortBy, direction);
    }

    @PutMapping("/{festivalId}")
    @PreAuthorize("hasRole('FESTIVAL_MANAGER')")
    @ResponseStatus(HttpStatus.OK)
    public Festival updateFestival(@PathVariable Long festivalId,
                                   @RequestBody FestivalUpdateDTO payload) {
        return festivalService.updateFestival(festivalId, payload);
    }


    @PatchMapping("/{festivalId}/camping-map")
    @PreAuthorize("hasRole('FESTIVAL_MANAGER')")
    @ResponseStatus(HttpStatus.OK)
    public void updateFestivalCampingMap(@PathVariable Long festivalId,
                                         @RequestPart FestivalCampingMapUpdateDTO payload,
                                         @RequestPart(required = false) Map<UnitType, Double> pricesByUnitType) throws IOException {
        festivalService.updateFestivalCampingMap(festivalId, payload, pricesByUnitType != null ? pricesByUnitType : Collections.emptyMap());
    }

    @DeleteMapping("/{festivalId}")
    @PreAuthorize("hasRole('FESTIVAL_MANAGER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFestivalById(@PathVariable Long festivalId) {
        festivalService.deleteFestivalById(festivalId);
    }
}
