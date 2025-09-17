package zairastra.capstone_be.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, JWTCheckerFilter jwtCheckerFilter) throws Exception {
        httpSecurity.formLogin(formLogin -> formLogin.disable());
        httpSecurity.csrf(csrf -> csrf.disable());
        httpSecurity.sessionManagement((sessions -> sessions.sessionCreationPolicy(SessionCreationPolicy.STATELESS)));
        httpSecurity.authorizeHttpRequests((authorized -> authorized
                        .requestMatchers("/", "/lineups/**", "/festivals/**", "/artists/**", "/auth/**", "/public-users/register").permitAll()
                        .requestMatchers("/admins/**").hasRole("SYSTEM_ADMIN")
                        .anyRequest().authenticated()))
                .addFilterBefore(jwtCheckerFilter, UsernamePasswordAuthenticationFilter.class);

        httpSecurity.cors(Customizer.withDefaults());

        return httpSecurity.build();
    }

    @Bean
    public PasswordEncoder getBCrypt() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
