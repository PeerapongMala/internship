namespace BSS_API.Models.RequestModels
{
    public class MasterUserRoleRequest
    {
        public int? UserRoleId { get; set; }
        public int? UserId { get; set; }
        public int? RoleGroupId { get; set; }
        public bool? IsActive { get; set; } 
    }
}
