package zairastra.capstone_be.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import zairastra.capstone_be.entities.User;
import zairastra.capstone_be.payloads.UserPswUpdateDTO;
import zairastra.capstone_be.services.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public Page<User> findAllUsers(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "10") int size,
                                   @RequestParam(defaultValue = "id") String sortBy) {
        return userService.findAllUsers(page, size, sortBy);
    }

    @GetMapping("/{userId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public User findUserById(@PathVariable Long userId) {
        return userService.findUserById(userId);
    }

    @GetMapping("/by-username/{username}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public User findUserByUsername(@PathVariable String username) {
        return userService.findUserByUsername(username);
    }

    @GetMapping("/by-email/{email}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public User findUserByEmail(@PathVariable String email) {
        return userService.findUserByEmail(email);
    }

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public User getMyProfile(@AuthenticationPrincipal User authorizedUser) {
        return authorizedUser;
    }

    @PatchMapping("/me/password")
    @ResponseStatus(HttpStatus.OK)
    public void updatePassword(@AuthenticationPrincipal User authenticatedUser, @RequestBody UserPswUpdateDTO payload) {
        Long userId = authenticatedUser.getId();
        userService.updatePassword(userId, payload);
    }
}
