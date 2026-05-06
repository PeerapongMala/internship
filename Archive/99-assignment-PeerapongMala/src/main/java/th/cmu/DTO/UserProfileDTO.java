package th.cmu.DTO;

import java.util.Set;

public class UserProfileDTO {
    private Long id;
    private String Name;
    private Long PermissionId;
    private Set<UserDTO> Users;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return Name;
    }

    public void setName(String Name) {
        this.Name = Name;
    }

    public Long getPermissionId() {
        return PermissionId;
    }

    public void setPermissionId(Long PermissionId) {
        this.PermissionId = PermissionId;
    }

    public Set<UserDTO> getUsers() {
        return Users;
    }

    public void setUsers(Set<UserDTO> Users) {
        this.Users = Users;
    }
}
