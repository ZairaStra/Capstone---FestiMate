package zairastra.capstone_be.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import zairastra.capstone_be.entities.User;
import zairastra.capstone_be.exceptions.UnauthorizedException;
import zairastra.capstone_be.services.UserService;
import zairastra.capstone_be.tools.JWTTools;

import java.io.IOException;
import java.util.Collection;

//@Component
//public class JWTCheckerFilter extends OncePerRequestFilter {
//    @Autowired
//    private JWTTools jwtTools;
//
//    @Autowired
//    private UserService userService;
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        String authHeader = request.getHeader("Authorization");
//
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            throw new UnauthorizedException("Invalid Token");
//        }
//
//        String accessToken = authHeader.replace("Bearer ", "");
//        jwtTools.verifyToken(accessToken);
//
//        Long userId = Long.parseLong(jwtTools.extractId(accessToken));
//
//        User authorizedUser = userService.findUserById(userId);
//
//        Authentication authentication = new UsernamePasswordAuthenticationToken(
//                authorizedUser,
//                null,
//                authorizedUser.getAuthorities()
//        );
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        filterChain.doFilter(request, response);
//    }
//
//    @Override
//    protected boolean shouldNotFilter(HttpServletRequest request) {
//        return new AntPathMatcher().match("/auth/**", request.getServletPath());
//    }
//}

@Component
public class JWTCheckerFilter extends OncePerRequestFilter {

    @Autowired
    private JWTTools jwtTools;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        System.out.println("1. FILTRO INTERNO TI PREGO FUNZIONA -" + request.getServletPath());

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            filterChain.doFilter(request, response);
//            return;
            throw new UnauthorizedException("Invalid Token");
        }

//        String extractedToken = authHeader.replace("Bearer ", "").trim();
//        jwtTools.verifyToken(extractedToken);
//
//        Long userId = Long.parseLong(jwtTools.extractId(extractedToken));
//        User authorizedUser = userService.findUserById(userId);
//
//        Collection<? extends GrantedAuthority> authorities = authorizedUser.getAuthorities();
//
//        Authentication authentication = new UsernamePasswordAuthenticationToken(
//                authorizedUser, null, authorities
//        );
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        System.out.println("DIMMI CHE RUOLO HAI: User " + authorizedUser.getUsername() + " authorities: " + authorities);


        String extractedToken = authHeader.replace("Bearer ", "").trim();
        try {
            jwtTools.verifyToken(extractedToken);
            Long userId = Long.parseLong(jwtTools.extractId(extractedToken));
            User authorizedUser = userService.findUserById(userId);

            Collection<? extends GrantedAuthority> authorities = authorizedUser.getAuthorities();

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    authorizedUser, null, authorities
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            System.out.println("Utente " + authorizedUser.getUsername() + " autenticato con ruoli: " + authorities);
        } catch (Exception ex) {
            throw new UnauthorizedException("Token non valido o scaduto: " + ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();
        String method = request.getMethod();
        System.out.println("FILTRO SHOULD NOT FILTER TI PREGO FUNZIONA -" + request.getServletPath());

        AntPathMatcher matcher = new AntPathMatcher();

        return matcher.match("/", path) ||
                matcher.match("/auth/login", path) ||
                (matcher.match("/public-users/register", path) && method.equalsIgnoreCase("POST")) ||
                (matcher.match("/auth/register", path) && method.equalsIgnoreCase("POST")) ||
                (matcher.match("/festivals", path) && method.equalsIgnoreCase("GET")) ||
                (matcher.match("/festivals/*", path) && method.equalsIgnoreCase("GET")) ||
                (matcher.match("/artists", path) && method.equalsIgnoreCase("GET")) ||
                (matcher.match("/artists/*", path) && method.equalsIgnoreCase("GET"));
    }
}
