package zairastra.capstone_be.payloads;

import zairastra.capstone_be.entities.enums.Department;
import zairastra.capstone_be.entities.enums.Role;

import java.time.LocalDate;

public record AdminResponseDTO(
        String username,
        String name,
        String surname,
        String email,
        String profileImg,
        String phoneNumber,
        Role role,
        Department department,
        LocalDate hireDate

) {
}
