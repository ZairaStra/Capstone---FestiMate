package zairastra.capstone_be.payloads;

import java.time.LocalDate;

public record PublicUserResponseDTO(String username,
                                    String name,
                                    String surname,
                                    String email,
                                    String city,
                                    String country,
                                    String profileImg,
                                    LocalDate registrationDate) {
}
