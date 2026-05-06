namespace BSS_WEB.Models.ObjectModel
{
    public class CreateRefreshTokenRequest
    {
        public int UserId { get; set; }
        public string? IpAddress { get; set; }
    }
}
