package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import zairastra.capstone_be.entities.Artist;
import zairastra.capstone_be.entities.Festival;

import java.time.LocalDate;
import java.time.LocalTime;

public record LineupRegistrationDTO(

        @NotNull(message = "Date is required")
        LocalDate date,

        @NotNull(message = "Start time is required")
        LocalTime startTime,

        @NotNull(message = "End time is required")
        LocalTime endTime,

        @NotBlank(message = "Artist is required")
        Artist artist,

        @NotBlank(message = "Festival il required")
        Festival festival
) {
}
