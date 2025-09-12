package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Set;

public record ReservationRegistrationDTO(

        @NotNull(message = "PublicUser id is required")
        Long userId,

        @NotNull(message = "Festival id is required")
        Long festivalId,

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        @NotNull(message = "End date is required")
        LocalDate endDate,

        @Min(1)
        Integer numTickets,

        @DecimalMin("0.1")
        Double totalPrice,
        
        Set<Long> campingUnitIds
) {
}
