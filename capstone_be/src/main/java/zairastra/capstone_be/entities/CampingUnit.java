package zairastra.capstone_be.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import zairastra.capstone_be.entities.enums.UnitStatus;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "camping_units")
public class CampingUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "camping_unit_id", nullable = false)
    private Long id;

    @NotBlank(message = "Spot code is required")
    @Column(name = "spot_code", nullable = false)
    private String spotCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UnitStatus status;

    @ManyToOne
    @JoinColumn(name = "accomodation_type_id", nullable = false)
    private AccomodationType accomodationType;

    public CampingUnit(String spotCode, UnitStatus status, AccomodationType accomodationType) {
        this.spotCode = spotCode;
        this.status = status;
        this.accomodationType = accomodationType;
    }
}
