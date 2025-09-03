package zairastra.capstone_be.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import zairastra.capstone_be.entities.Festival;
import zairastra.capstone_be.entities.PublicUser;
import zairastra.capstone_be.exceptions.BadRequestException;
import zairastra.capstone_be.exceptions.NotFoundException;
import zairastra.capstone_be.payloads.PublicUserRegistrationDTO;
import zairastra.capstone_be.payloads.PublicUserUpdateDTO;
import zairastra.capstone_be.payloads.UserRegistrationResponseDTO;
import zairastra.capstone_be.repositories.PublicUserRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
public class PublicUserService {

    @Autowired
    private PublicUserRepository publicUserRepository;

    @Autowired
    private PasswordEncoder bCrypt;

    public UserRegistrationResponseDTO createPublicUser(PublicUserRegistrationDTO payload) {
        publicUserRepository.findByEmailIgnoreCase(payload.email()).ifPresent(user -> {
            throw new BadRequestException("A user with email " + payload.email() + " already exists in our system");
        });
        publicUserRepository.findByUsernameIgnoreCase(payload.username()).ifPresent(user -> {
            throw new BadRequestException("A user with username " + payload.username() + " already exists in our system");
        });

        PublicUser newPublicUser = new PublicUser(
                payload.username(),
                payload.name(),
                payload.surname(),
                payload.email(),
                bCrypt.encode((payload.password())),
                payload.profileImg(),
                payload.city(),
                payload.country()
        );

        newPublicUser.setRegistrationDate(LocalDate.now());

        PublicUser savedUser = publicUserRepository.save(newPublicUser);
        log.info("The public user " + payload.name() + " " + payload.surname() + " has been saved");

        return new UserRegistrationResponseDTO(savedUser.getId());
    }

    public List<PublicUser> findAllPublicUsers() {
        return publicUserRepository.findAll();
    }

    public PublicUser findPublicUserById(Long id) {
        return publicUserRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("PublicUser with id " + id + " not found"));
    }

    public PublicUser findPublicUserByUsername(String username) {
        return publicUserRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new NotFoundException("PublicUser with username " + username + " not found"));
    }

    public PublicUser findPublicUserByEmail(String email) {
        return publicUserRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("PublicUser with email " + email + " not found"));
    }

    public PublicUser updatePublicUser(Long id, PublicUserUpdateDTO payload) {

        PublicUser publicUser = findPublicUserById(id);
        publicUser.setUsername(payload.username());
        publicUser.setName(payload.name());
        publicUser.setSurname(payload.surname());
        publicUser.setCity(payload.city());
        publicUser.setCountry(payload.country());
        publicUser.setProfileImg(payload.profileImg());

        return publicUserRepository.save(publicUser);
    }

    public void deletePublicUserById(Long id) {
        PublicUser user = findPublicUserById(id);
        publicUserRepository.delete(user);
    }

    public PublicUser addFestivalToWishlist(Long userId, Festival festival) {
        PublicUser user = findPublicUserById(userId);
        user.getWishlist().add(festival);
        return publicUserRepository.save(user);
    }

    public PublicUser removeFestivalFromWishlist(Long userId, Festival festival) {
        PublicUser user = findPublicUserById(userId);
        user.getWishlist().remove(festival);
        return publicUserRepository.save(user);
    }


}
