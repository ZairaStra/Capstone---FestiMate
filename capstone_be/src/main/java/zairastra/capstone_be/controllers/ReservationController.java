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
import zairastra.capstone_be.entities.PublicUser;
import zairastra.capstone_be.entities.Reservation;
import zairastra.capstone_be.exceptions.ValidationException;
import zairastra.capstone_be.payloads.ReservationRegistrationDTO;
import zairastra.capstone_be.payloads.ReservationRegistrationResponseDTO;
import zairastra.capstone_be.services.ReservationService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping("/me/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationRegistrationResponseDTO createReservation(@AuthenticationPrincipal PublicUser authenticatedUser, @RequestBody @Validated ReservationRegistrationDTO payload, BindingResult validationResult) {

        if (validationResult.hasErrors()) {
            List<String> errors = validationResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage())
                    .toList();
            throw new ValidationException(errors);
        }

        Reservation savedReservation = reservationService.createReservation(payload, authenticatedUser);
        return new ReservationRegistrationResponseDTO(savedReservation.getId());
    }

    @GetMapping
    @PreAuthorize("hasRole('RESERVATION_MANAGER')")
    @ResponseStatus(HttpStatus.OK)
    public Page<Reservation> findAllReservations(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size,
                                                 @RequestParam(defaultValue = "id") String sortBy) {

        return reservationService.findAllReservations(page, size, sortBy);
    }

    @GetMapping("/{reservationId}")
    @PreAuthorize("hasRole('RESERVATION_MANAGER')")
    @ResponseStatus(HttpStatus.OK)
    public Reservation findReservationById(@PathVariable Long reservationId) {
        return reservationService.findReservationById(reservationId);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('RESERVATION_MANAGER')")
    @ResponseStatus(HttpStatus.OK)
    public Page<Reservation> searchReservations(
            @RequestParam(required = false) Long festivalId,
            @RequestParam(required = false) Long campingId,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        return reservationService.searchReservations(festivalId, campingId, userId, startDate, endDate, page, size, sortBy, direction);
    }

    @DeleteMapping("/{reservationId}")
    @PreAuthorize("hasRole('RESERVATION_MANAGER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReservation(@PathVariable Long reservationId) {
        reservationService.deleteReservation(reservationId);
    }

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public Page<Reservation> getMyReservations(@AuthenticationPrincipal PublicUser authenticatedUser,
                                               @RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "10") int size,
                                               @RequestParam(defaultValue = "id") String sortBy) {
        return reservationService.findMyReservations(authenticatedUser.getId(), page, size, sortBy);
    }
}
