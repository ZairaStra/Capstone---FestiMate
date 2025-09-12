package zairastra.capstone_be.payloads;

import zairastra.capstone_be.entities.Artist;
import zairastra.capstone_be.entities.Festival;

import java.time.LocalDate;
import java.time.LocalTime;

public record LineupUpdateDTO(

        LocalDate date,

        LocalTime startTime,

        LocalTime endTime,

        Artist artist,

        Festival festival
) {
}
