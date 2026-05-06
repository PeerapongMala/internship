using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class MasterRolePermissionData
    {
        public int RoleId { get; set; }
        public string? RoleName { get; set; }
        public int RoleGroupId { get; set; }
        public string? RoleGroupName { get; set; }
        public bool? IsActive { get; set; }
    }
}
