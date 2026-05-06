namespace BSS_WEB.Models.ObjectModel
{
    public class MasterRolePermissionData
    {
        public int roleId { get; set; }
        public string? roleName { get; set; }
        public int roleGroupId { get; set; }
        public string? roleGroupName { get; set; }
        public bool? isActive { get; set; }
    }
}
