namespace BSS_API.Models.RequestModels
{
    public class MasterRolePermissionRequest
    {         
        public int? RolePermissionId { get; set; }
        public int? RoleId { get; set; }
        public int? MenuId { get; set; } 
        public bool? IsActive { get; set; } 
    }
}
