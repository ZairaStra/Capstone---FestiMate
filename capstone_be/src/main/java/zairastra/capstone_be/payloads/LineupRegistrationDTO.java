package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record LineupRegistrationDTO(

        @NotNull(message = "Date is required")
        LocalDate date,

        @NotNull(message = "Start time is required")
        LocalTime startTime,

        @NotNull(message = "End time is required")
        LocalTime endTime,

        @NotNull(message = "Artist id is required")
        Long artistId,

        @NotNull(message = "Festival id il required")
        Long festivalId
) {
}
