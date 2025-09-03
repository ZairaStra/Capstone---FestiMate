package zairastra.capstone_be.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import zairastra.capstone_be.entities.User;
import zairastra.capstone_be.exceptions.UnauthorizedException;
import zairastra.capstone_be.payloads.LoginDTO;
import zairastra.capstone_be.tools.JWTTools;


@Service
public class AuthorizationService {
    @Autowired
    private UserService userService;

    @Autowired
    private JWTTools jwtTools;

    @Autowired
    private PasswordEncoder bCrypt;

    public String checkEmailBeforeLogin(LoginDTO payload) {
        User found = userService.findUserByEmail(payload.email());
        if (bCrypt.matches(payload.password(), found.getPassword())) {
            String extractedToken = jwtTools.createToken(found);
            return extractedToken;
        } else {
            throw new UnauthorizedException("Unauthorized - try again");
        }
    }
}
