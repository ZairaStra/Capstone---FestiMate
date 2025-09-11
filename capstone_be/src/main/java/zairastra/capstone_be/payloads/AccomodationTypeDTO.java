package zairastra.capstone_be.payloads;

import zairastra.capstone_be.entities.enums.UnitType;

public record AccomodationTypeDTO(
        UnitType unitType,
        int capacity
) {
}
