package th.cmu.Entities;

import javax.persistence.*;
import java.util.Set;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToMany
    @JoinTable(
        name = "owner_vehicle",
        joinColumns = @JoinColumn(name = "owner_id"),
        inverseJoinColumns = @JoinColumn(name = "vehicle_id")
    )
    private Set<UserProfile> UserProfile;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<UserProfile> getUserProfiles() {
        return UserProfile;
    }

    public void setUserProfiles(Set<UserProfile> UserProfile) {
        this.UserProfile = UserProfile;
    }
}
