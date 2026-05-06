namespace BSS_WEB.Models.ObjectModel
{
    public class RefreshTokenAndNewGenerateRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
        public int UserId { get; set; }
        public int DepartmentId { get; set; }
    }
}
