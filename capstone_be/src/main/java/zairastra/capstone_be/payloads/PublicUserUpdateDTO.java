package zairastra.capstone_be.payloads;

import jakarta.validation.constraints.NotEmpty;

public record PublicUserUpdateDTO(@NotEmpty(message = "Username is required")
                                  String username,

                                  @NotEmpty(message = "Name is required")
                                  String name,

                                  @NotEmpty(message = "Surname is required")
                                  String surname,

                                  @NotEmpty(message = "City is required")
                                  String city,

                                  @NotEmpty(message = "Country is required")
                                  String country,

                                  String profileImg) {
}
