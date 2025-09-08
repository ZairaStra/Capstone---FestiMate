package zairastra.capstone_be.payloads;

public record UserResponseDTO(
        String username,
        String name,
        String surname,
        String email,
        String profileImg
) {
}
