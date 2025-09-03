package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.NotEmpty;
import zairastra.capstone_be.entities.enums.Department;
import zairastra.capstone_be.entities.enums.Role;

public record AdminUpdateDTO(
        @NotEmpty(message = "Username is required")
        String username,

        @NotEmpty(message = "Name is required")
        String name,

        @NotEmpty(message = "Surname is required")
        String surname,

        @NotEmpty(message = "Role is required")
        Role role,

        @NotEmpty(message = "Department is required")
        Department department,

        String profileImg
) {
}
