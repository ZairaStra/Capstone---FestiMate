package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;

public record FestivalUpdateDTO(

        String name,


        String city,

        String country,

        LocalDate startDate,

        LocalDate endDate,

        @Min(value = 1, message = "Maximum participants must be greater than 0")
        Integer maxNumbPartecipants,

        @DecimalMin(value = "0.1", message = "Daily price must be positive")
        Double dailyPrice,

        String coverImg
) {
}
