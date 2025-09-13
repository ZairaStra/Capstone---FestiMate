package zairastra.capstone_be.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import zairastra.capstone_be.entities.User;
import zairastra.capstone_be.exceptions.BadRequestException;
import zairastra.capstone_be.exceptions.NotFoundException;
import zairastra.capstone_be.payloads.UserPswUpdateDTO;
import zairastra.capstone_be.payloads.UserResponseDTO;
import zairastra.capstone_be.repositories.UserRepository;
import zairastra.capstone_be.tools.MailgunSender;

@Slf4j
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder bCrypt;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private MailgunSender mailgunSender;


    public void sendRegistrationEmail(User user) {
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        mailgunSender.sendRegistrationEmail(user);
    }

    public Page<User> findAllUsers(int page, int size, String sortBy) {
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return userRepository.findAll(pageable);
    }

    public User findUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new NotFoundException("User with id " + id + " not found"));
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsernameIgnoreCase(username).orElseThrow(() -> new NotFoundException("User with username " + username + " not found"));
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new NotFoundException("User with email " + email + " not found"));
    }

    public Page<User> findUsersByUsername(String username, int page, int size, String sortBy) {

        if (username == null || username.isBlank()) {
            throw new BadRequestException("Search string must not be empty");
        }

        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return userRepository.findByUsernameStartingWithIgnoreCase(username, pageable);
    }

    public Page<User> findUsersByEmail(String email, int page, int size, String sortBy) {

        if (email == null || email.isBlank()) {
            throw new BadRequestException("Search string must not be empty");
        }

        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return userRepository.findByEmailContainingIgnoreCase(email, pageable);
    }

    public UserResponseDTO getMyProfile(User user) {
        return new UserResponseDTO(
                user.getUsername(),
                user.getName(),
                user.getSurname(),
                user.getEmail(),
                user.getProfileImg()
        );
    }

    public void updatePassword(Long userId, UserPswUpdateDTO payload) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));

        if (!bCrypt.matches(payload.oldPassword(), user.getPassword())) {
            throw new BadRequestException("Old password is incorrect");
        }

        user.setPassword(bCrypt.encode(payload.newPassword()));
        userRepository.save(user);

        log.info("Password updated for user " + user.getUsername());
    }

    public User updateProfileImg(Long userId, MultipartFile file) {

        User user = findUserById(userId);
        String imgURL = cloudinaryService.uploadFile(file);
        user.setProfileImg(imgURL);
        return userRepository.save(user);

    }

}

