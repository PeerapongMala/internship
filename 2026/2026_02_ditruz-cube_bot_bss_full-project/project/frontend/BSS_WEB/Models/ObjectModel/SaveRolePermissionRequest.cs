namespace BSS_WEB.Models.ObjectModel
{
    public class SaveRolePermissionRequest
    {
        public int roleId { get; set; } = 0;
        public List<CreateRoleMenuSelectedData> menuItemSelected { get; set; } = new List<CreateRoleMenuSelectedData>();
        public bool isActive { get; set; } = false;
    }
}
