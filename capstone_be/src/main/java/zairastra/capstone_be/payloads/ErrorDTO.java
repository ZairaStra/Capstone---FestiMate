package zairastra.capstone_be.payloads;

import java.time.LocalDateTime;

public record ErrorDTO(String message, LocalDateTime stamp) {
}
