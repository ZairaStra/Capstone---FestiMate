package zairastra.capstone_be.entities;


import jakarta.persistence.*;
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
@ToString(exclude = {"reservations"})
@Entity
@Table(name = "festivals")
public class Festival {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "festival_id", nullable = false)
    private Long id;

    @NotBlank(message = "Festival name is required")
    private String name;

    @Column(name = "cover_img")
    private String coverImg;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Country is required")
    private String country;

    @NotNull(message = "Start date is required")
    @Column(name = "start_date")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @Column(name = "end_date")
    private LocalDate endDate;

    @NotNull(message = "Maximum number of participants is required")
    @Column(name = "max_numb_part")
    private Integer maxNumbPartecipants;

    @NotNull(message = "Daily ticket price is required")
    @Column(name = "daily_price")
    private Double dailyPrice;

    @Lob
    @Column(name = "camping_map")
    private String campingMap;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Admin eventPlanner;

    public Festival(String name, String coverImg, String city, String country, LocalDate startDate, LocalDate endDate, Integer maxNumbPartecipants, Double dailyPrice, Admin user) {
        this.name = name;
        this.coverImg = coverImg;
        this.city = city;
        this.country = country;
        this.startDate = startDate;
        this.endDate = endDate;
        this.maxNumbPartecipants = maxNumbPartecipants;
        this.dailyPrice = dailyPrice;
        this.eventPlanner = user;
    }
}
