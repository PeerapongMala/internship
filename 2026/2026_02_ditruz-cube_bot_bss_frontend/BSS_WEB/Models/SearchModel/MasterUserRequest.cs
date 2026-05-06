namespace BSS_API.Models.RequestModels
{
    public class MasterUserRequest
    {
        public int? UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public int? DepartmentId { get; set; }
        public int? RoleGroupId { get; set; }
        public bool? IsActive { get; set; }
    }
}

