package zairastra.capstone_be.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import zairastra.capstone_be.entities.Festival;
import zairastra.capstone_be.entities.PublicUser;
import zairastra.capstone_be.entities.User;
import zairastra.capstone_be.payloads.PublicUserRegistrationDTO;
import zairastra.capstone_be.payloads.PublicUserUpdateDTO;
import zairastra.capstone_be.payloads.UserRegistrationResponseDTO;
import zairastra.capstone_be.services.PublicUserService;

@RestController
@RequestMapping("/public-users")
public class PublicUserController {

    @Autowired
    private PublicUserService publicUserService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserRegistrationResponseDTO createPublicUser(@RequestBody PublicUserRegistrationDTO payload) {
        return publicUserService.createPublicUser(payload);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('USER_MANAGER')")
    public Page<PublicUser> findAllPublicUsers(@RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "10") int size,
                                               @RequestParam(defaultValue = "id") String sortBy) {
        return publicUserService.findAllPublicUsers(page, size, sortBy);
    }

    @GetMapping("/{public-userId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('USER_MANAGER')")
    public User findPublicUserById(@PathVariable Long publicUserId) {
        return publicUserService.findPublicUserById(publicUserId);
    }

    @GetMapping("/by-username/{username}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('USER_MANAGER')")
    public User findPublicUserByUsername(@PathVariable String username) {
        return publicUserService.findPublicUserByUsername(username);
    }

    @GetMapping("/by-email/{email}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('USER_MANAGER')")
    public User findPublicUserByEmail(@PathVariable String email) {
        return publicUserService.findPublicUserByEmail(email);
    }

    @PutMapping("/{publicUserId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('USER_MANAGER') or #publicUserId == principal.id")
    public PublicUser updatePublicUser(@PathVariable Long publicUserId, @RequestBody PublicUserUpdateDTO payload) {
        return publicUserService.updatePublicUser(publicUserId, payload);
    }

    @DeleteMapping("/{publicUserId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('USER_MANAGER') or #publicUserId == principal.id")
    public void deletePublicUserById(@PathVariable Long publicUserId) {
        publicUserService.deletePublicUserById(publicUserId);
    }

    @PostMapping("/me/wishlist")
    @ResponseStatus(HttpStatus.CREATED)
    public PublicUser addFestivalToWishlist(@AuthenticationPrincipal PublicUser authenticatedUser, @RequestBody Festival festival) {
        Long publicUserId = authenticatedUser.getId();
        return publicUserService.addFestivalToWishlist(publicUserId, festival);
    }

    @DeleteMapping("/me/wishlist")
    @ResponseStatus(HttpStatus.OK)
    public PublicUser removeFestivalFromWishlist(@AuthenticationPrincipal PublicUser authenticatedUser, @RequestBody Festival festival) {
        Long publicUserId = authenticatedUser.getId();
        return publicUserService.removeFestivalFromWishlist(publicUserId, festival);
    }
}

