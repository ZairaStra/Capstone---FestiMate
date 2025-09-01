package zairastra.capstone_be.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import zairastra.capstone_be.entities.enums.UnitType;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "accomodation_types")
public class AccomodationType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accomodation_type_id", nullable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "unit_type", nullable = false)
    private UnitType unitType;

    @Min(value = 1, message = "Unit capacity must be at least 1")
    @Column(name = "unit_capacity", nullable = false)
    private Integer unitCapacity;

    @DecimalMin(value = "0.1", message = "Price must be positive")
    @Column(name = "price_per_night", nullable = false)
    private Double pricePerNight;


    @ManyToOne
    @JoinColumn(name = "camping_id", nullable = false)
    private Camping camping;

    public AccomodationType(UnitType unitType, int unitCapacity, double pricePerNight, Camping camping) {
        this.unitType = unitType;
        this.unitCapacity = unitCapacity;
        this.pricePerNight = pricePerNight;
        this.camping = camping;
    }
}
