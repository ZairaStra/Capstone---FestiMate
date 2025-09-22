package zairastra.capstone_be.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"user", "festival"})
@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id", nullable = false)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private PublicUser user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "festival_id", nullable = false)
    private Festival festival;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Tickets number is required")
    @Min(value = 1, message = "Tickets number must be at least 1")
    private Integer numTickets;

    @NotNull(message = "Total price is required")
    @DecimalMin(value = "0.0", message = "Price must be positive")
    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Column(name = "created_at")
    @NotNull(message = "Reservation date and time are required")
    private LocalDateTime createdAt;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(
            name = "reservation_camping_units",
            joinColumns = @JoinColumn(name = "reservation_id"),
            inverseJoinColumns = @JoinColumn(name = "camping_unit_id")
    )
    private Set<CampingUnit> campingUnits = new HashSet<>();


    public Reservation(PublicUser user, Festival festival, LocalDate startDate, LocalDate endDate, int numTickets, double totalPrice, Set<CampingUnit> campingUnits) {
        this.user = user;
        this.festival = festival;
        this.startDate = startDate;
        this.endDate = endDate;
        this.numTickets = numTickets;
        this.totalPrice = totalPrice;
        this.createdAt = LocalDateTime.now();
        this.campingUnits = campingUnits != null ? campingUnits : new HashSet<>();
    }

}