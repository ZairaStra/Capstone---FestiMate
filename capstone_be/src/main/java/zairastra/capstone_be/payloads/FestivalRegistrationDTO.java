package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public record FestivalRegistrationDTO(
        @NotBlank(message = "Festival name is required")
        String name,

        String coverImg,

        @NotBlank(message = "City is required")
        String city,

        @NotBlank(message = "Country is required")
        String country,

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        @NotNull(message = "End date is required")
        LocalDate endDate,

        @NotNull(message = "Maximum number of participants is required")
        @Min(value = 1, message = "Maximum participants must be greater than 0")
        Integer maxNumbPartecipants,

        @NotNull(message = "Daily ticket price is required")
        @DecimalMin(value = "0.1", message = "Daily price must be positive")
        Double dailyPrice,

        MultipartFile campingMap
) {
}
