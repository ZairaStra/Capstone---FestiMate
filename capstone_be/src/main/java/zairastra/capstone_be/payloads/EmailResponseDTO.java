package zairastra.capstone_be.payloads;

import java.time.LocalDateTime;

public record EmailResponseDTO(String message, String recipientEmail,
                               LocalDateTime timestamp) {
}
