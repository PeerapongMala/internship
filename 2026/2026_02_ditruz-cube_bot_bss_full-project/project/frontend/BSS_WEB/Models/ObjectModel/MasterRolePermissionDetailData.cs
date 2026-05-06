namespace BSS_WEB.Models.ObjectModel
{
    public class MasterRolePermissionDetailData
    {
        public int rolePermissionId { get; set; }
        public int roleId { get; set; }
        public string? roleName { get; set; }
        public int menuId { get; set; }
        public string menuName { get; set; }
        public DateTime assignedDateTime { get; set; } = DateTime.Now;
        public bool? isActive { get; set; }
        public int? parentMenuId { get; set; }
    }
}
