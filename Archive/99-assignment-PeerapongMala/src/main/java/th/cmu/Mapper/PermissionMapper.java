package th.cmu.Mapper;

import th.cmu.DTO.PermissionDTO;
import th.cmu.Entities.Permission;

public class PermissionMapper {

    public static PermissionDTO toDTO(Permission permission) {
        PermissionDTO dto = new PermissionDTO();
        dto.setId(permission.getId());
        dto.setAccessNumber(permission.getAccessNumber());
        return dto;
    }

    public static Permission toEntity(PermissionDTO permissionDTO) {
        Permission permission = new Permission();
        permission.setId(permissionDTO.getId());
        permission.setAccessNumber(permissionDTO.getAccessNumber());
        return permission;
    }
}
