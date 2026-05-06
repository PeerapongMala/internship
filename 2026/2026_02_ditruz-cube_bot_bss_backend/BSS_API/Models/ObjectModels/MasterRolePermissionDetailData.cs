namespace BSS_API.Models.ObjectModels
{
    public class MasterRolePermissionDetailData
    {
        public int RolePermissionId { get; set; }
        public int RoleId { get; set; }
        public string? RoleName { get; set; }
        public int MenuId { get; set; }
        public string MenuName { get; set; }
        public DateTime AssignedDateTime { get; set; } = DateTime.Now;
        public bool? IsActive { get; set; }
        public int? ParentMenuId { get; set; }
    }
}
