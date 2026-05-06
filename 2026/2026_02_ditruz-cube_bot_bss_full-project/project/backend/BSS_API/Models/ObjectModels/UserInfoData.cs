namespace BSS_API.Models.ObjectModels
{
    public class UserInfoData
    {
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? UsernameDisplay { get; set; }
        public string? UserEmail { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public bool? IsInternal { get; set; }
    }
}
