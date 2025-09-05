package zairastra.capstone_be.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"wishlist"})
@Entity
@Table(name = "public_users")
@PrimaryKeyJoinColumn(name = "user_id")
public class PublicUser extends User {

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Country is required")
    private String country;

    @ManyToMany
    @JoinTable(
            name = "wishlist",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "festival_id")
    )
    private Set<Festival> wishlist = new HashSet<>();

    public PublicUser(String username, String name, String surname, String email, String password, String profileImg, String city, String country) {
        super(username, name, surname, email, password);
        this.city = city;
        this.country = country;
        this.wishlist = new HashSet<>();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }


}
