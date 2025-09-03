package zairastra.capstone_be.payloads;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorsWithListDTO(String message, LocalDateTime stamp, List<String> errorsList) {
}
