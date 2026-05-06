namespace BSS_API.Models.ObjectModels
{
    public class UserLoginDropdownData
    {
        public int UserId { get; set; }
        public int DepartmentId { get; set; }
        public string? UserName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DepartmentName { get; set; }
        public string? RoleGroupName { get; set; }
    }
}
