package th.cmu.Mapper;

import th.cmu.DTO.RoleDTO;
import th.cmu.Entities.Role;

import java.util.stream.Collectors;

public class RoleMapper {

    public static RoleDTO toDTO(Role role) {
        RoleDTO dto = new RoleDTO();
        dto.setId(role.getId());
        dto.setName(role.getName());
        dto.setPermissions(role.getPermissions().stream()
                .map(PermissionMapper::toDTO)
                .collect(Collectors.toSet()));
        return dto;
    }

    public static Role toEntity(RoleDTO roleDTO) {
        Role role = new Role();
        role.setId(roleDTO.getId());
        role.setName(roleDTO.getName());
        role.setPermissions(roleDTO.getPermissions().stream()
                .map(PermissionMapper::toEntity)
                .collect(Collectors.toSet()));
        return role;
    }
}
