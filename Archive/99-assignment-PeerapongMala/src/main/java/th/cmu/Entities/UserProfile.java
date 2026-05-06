package th.cmu.Entities;

import javax.persistence.*;
import java.util.Set;

@Entity
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String PermissionId;

    @OneToOne
    @JoinColumn(name = "parking_spot_id")
    private Permission Permission;

    @ManyToMany(mappedBy = "vehicles")
    private Set<User> Users;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLicensePlate() {
        return PermissionId;
    }

    public void setLicensePlate(String PermissionId) {
        this.PermissionId = PermissionId;
    }

    public Permission getPermission() {
        return Permission;
    }

    public void setPermission(Permission Permission) {
        this.Permission = Permission;
    }

    public Set<User> getUsers() {
        return Users;
    }

    public void setUsers(Set<User> Users) {
        this.Users = Users;
    }
}
