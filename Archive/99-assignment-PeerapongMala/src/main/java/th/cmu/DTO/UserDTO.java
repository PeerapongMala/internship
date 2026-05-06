package th.cmu.DTO;

import java.util.Set;

public class UserDTO {
    private Long id;
    private String name;
    private Set<UserProfileDTO> UserProfile;

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

    public Set<UserProfileDTO> getUserProfiles() {
        return UserProfile;
    }

    public void setUserProfiles(Set<UserProfileDTO> UserProfile) {
        this.UserProfile = UserProfile;
    }
}
