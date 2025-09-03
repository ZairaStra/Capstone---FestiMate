package zairastra.capstone_be.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import zairastra.capstone_be.entities.User;
import zairastra.capstone_be.exceptions.UnauthorizedException;
import zairastra.capstone_be.services.UserService;
import zairastra.capstone_be.tools.JWTTools;

import java.io.IOException;

@Component
public class JWTCheckerFilter extends OncePerRequestFilter {
    @Autowired
    private JWTTools jwtTools;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //AUTHENTICATION
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new UnauthorizedException("Insert a valid token");

        String extractedToken = authHeader.replace("Bearer ", "");
        jwtTools.verifyToken(extractedToken);

        //AUTHORIZATION
        String userId = jwtTools.extractId(extractedToken);
        User authorizedUser = this.userService.findUserById(Long.parseLong(userId));

        Authentication authentication = new UsernamePasswordAuthenticationToken(authorizedUser, null, authorizedUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        AntPathMatcher matcher = new AntPathMatcher();
        String path = request.getServletPath();
        String method = request.getMethod();

        return          //homepage accessibile
                matcher.match("/", path) ||
                        //login accessibile
                        matcher.match("/auth/login", path) ||
                        //creazione accessibile (ricordati di filtrare l'admin per ruolo SySTEM_ADMIN)
                        (matcher.match("/auth/register", path) && method.equalsIgnoreCase("POST")) ||
                        //tutte le ricerche sull'elenco di festival sono accessibili
                        (matcher.match("/festivals", path) && method.equalsIgnoreCase("GET")) ||
                        //tutte le ricerca sui dettagli del festival sono accessibili
                        (matcher.match("/festivals/*", path) && method.equalsIgnoreCase("GET")) ||
                        //tutte le ricerche sull'elenco di artisti sono accessibili
                        (matcher.match("/artists", path) && method.equalsIgnoreCase("GET")) ||
                        //tutte le ricerca sui dettagli degli artisti sono accessibili
                        (matcher.match("/artists/*", path) && method.equalsIgnoreCase("GET"));
    }
}
