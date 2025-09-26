package zairastra.capstone_be.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import zairastra.capstone_be.entities.Festival;
import zairastra.capstone_be.entities.PublicUser;
import zairastra.capstone_be.exceptions.BadRequestException;
import zairastra.capstone_be.exceptions.NotFoundException;
import zairastra.capstone_be.payloads.PublicUserRegistrationDTO;
import zairastra.capstone_be.payloads.PublicUserResponseDTO;
import zairastra.capstone_be.payloads.PublicUserUpdateDTO;
import zairastra.capstone_be.repositories.FestivalRepository;
import zairastra.capstone_be.repositories.PublicUserRepository;

import java.time.LocalDate;

@Service
@Slf4j
public class PublicUserService {

    @Autowired
    private PublicUserRepository publicUserRepository;

    @Autowired
    private PasswordEncoder bCrypt;

    @Autowired
    private UserService userService;

    @Autowired
    private FestivalRepository festivalRepository;

    public PublicUser createPublicUser(PublicUserRegistrationDTO payload) {

        publicUserRepository.findByEmailIgnoreCase(payload.email()).ifPresent(publicUser -> {
            throw new BadRequestException("A user with email " + payload.email() + " already exists in our system");
        });

        publicUserRepository.findByUsernameIgnoreCase(payload.username()).ifPresent(publicUser -> {
            throw new BadRequestException("A user with username " + payload.username() + " already exists in our system");
        });

        PublicUser newPublicUser = new PublicUser(
                payload.username(),
                payload.name(),
                payload.surname(),
                payload.email(),
                bCrypt.encode(payload.password()),
                payload.profileImg(),
                payload.city(),
                payload.country()
        );

        newPublicUser.setProfileImg(payload.profileImg());

        newPublicUser.setRegistrationDate(LocalDate.now());

        PublicUser savedPublicUser = publicUserRepository.save(newPublicUser);
        log.info("The public user " + payload.name() + " " + payload.surname() + " has been saved");

        userService.sendRegistrationEmail(savedPublicUser);

        return savedPublicUser;
    }

    public Page<PublicUser> findAllPublicUsers(int page, int size, String sortBy) {
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return publicUserRepository.findAll(pageable);
    }

    public PublicUser findPublicUserById(Long id) {
        return publicUserRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("PublicUser with id " + id + " not found"));
    }

    public PublicUser findPublicUserByEmail(String email) {
        return publicUserRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("PublicUser with email " + email + " not found"));
    }

    public PublicUserResponseDTO getMyProfile(PublicUser publicUser) {
        return new PublicUserResponseDTO(
                publicUser.getUsername(),
                publicUser.getName(),
                publicUser.getSurname(),
                publicUser.getEmail(),
                publicUser.getCity(),
                publicUser.getCountry(),
                publicUser.getProfileImg(),
                publicUser.getRegistrationDate()
        );
    }

    public PublicUser updatePublicUser(Long id, PublicUserUpdateDTO payload) {

        publicUserRepository.findByUsernameIgnoreCase(payload.username())
                .filter(existingPublicUser -> !existingPublicUser.getId().equals(id))
                .ifPresent(existingPublicUser -> {
                    throw new BadRequestException("A public user with username " + payload.username() + " already exists in our system");
                });

        publicUserRepository.findByEmailIgnoreCase(payload.email())
                .filter(existingPublicUser -> !existingPublicUser.getId().equals(id))
                .ifPresent(existingPublicUser -> {
                    throw new BadRequestException("A public user with email " + payload.email() + " already exists in our system");
                });

        PublicUser publicUser = findPublicUserById(id);
        publicUser.setUsername(payload.username());
        publicUser.setName(payload.name());
        publicUser.setSurname(payload.surname());
        publicUser.setEmail(payload.email());
        publicUser.setCity(payload.city());
        publicUser.setCountry(payload.country());

        PublicUser updatedPublicUser = publicUserRepository.save(publicUser);

        log.info("Public User " + publicUser.getUsername() + " has been updated");

        return updatedPublicUser;
    }

    public void deletePublicUserById(Long id) {
        PublicUser publicUser = findPublicUserById(id);

        publicUserRepository.delete(publicUser);

        log.info("Public User " + publicUser.getUsername() + " has been deleted");
    }

    public Page<Festival> getWishlist(Long userId, int page, int size) {
        PublicUser user = publicUserRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Public user not found"));

        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size);

        return festivalRepository.findWishlistByUserId(user.getId(), pageable);
    }

    public PublicUser addFestivalToWishlist(Long userId, Festival festival) {
        PublicUser publicUser = findPublicUserById(userId);
        publicUser.getWishlist().add(festival);
        return publicUserRepository.save(publicUser);
    }

    public PublicUser removeFestivalFromWishlist(Long userId, Long festivalId) {
        PublicUser publicUser = findPublicUserById(userId);

        Festival festival = festivalRepository.findById(festivalId)
                .orElseThrow(() -> new NotFoundException("Festival with id " + festivalId + " not found"));

        publicUser.getWishlist().remove(festival);
        return publicUserRepository.save(publicUser);
    }
}
