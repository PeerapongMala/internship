package th.cmu.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import th.cmu.Entities.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    List<Role> findAll();
    Optional<Role> findById(Long id);
    Role save(Role role);
    void deleteById(Long id);

}
