package zairastra.capstone_be.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import zairastra.capstone_be.payloads.LoginDTO;
import zairastra.capstone_be.payloads.LoginResponseDTO;
import zairastra.capstone_be.services.AuthorizationService;
import zairastra.capstone_be.services.UserService;


@RestController
@RequestMapping("/auth")
public class AuthorizationController {
    @Autowired
    public UserService userService;

    @Autowired
    public AuthorizationService authorizationsService;
    
    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginDTO payload) {
        String extractedToken = authorizationsService.checkEmailBeforeLogin(payload);
        return new LoginResponseDTO(extractedToken);
    }
}
