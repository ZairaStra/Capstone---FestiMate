package zairastra.capstone_be.payloads;

import java.time.LocalDate;
import java.time.LocalTime;

public record LineupUpdateDTO(

        LocalDate date,

        LocalTime startTime,

        LocalTime endTime,

        Long artistId,

        Long festivalId
) {
}
