package zairastra.capstone_be.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "campings")
public class Camping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "camping_id", nullable = false)
    private Long id;

    @OneToOne
    @JoinColumn(name = "festival_id", nullable = false)
    private Festival festival;

    @NotBlank(message = "Camping name is required")
    private String name;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be greater than 0")
    private Integer capacity;

    @NotNull(message = "Opening date is required")
    @Column(name = "opening_date")
    private LocalDate openingDate;

    @NotNull(message = "Closing date is required")
    @Column(name = "closing_date")
    private LocalDate closingDate;


    public Camping(Festival festival, String name, int capacity, LocalDate openingDate, LocalDate closingDate) {
        this.festival = festival;
        this.name = name;
        this.capacity = capacity;
        this.openingDate = openingDate;
        this.closingDate = closingDate;
    }
}
