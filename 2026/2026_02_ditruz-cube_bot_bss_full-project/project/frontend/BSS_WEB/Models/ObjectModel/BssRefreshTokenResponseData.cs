namespace BSS_WEB.Models.ObjectModel
{
    public class BssRefreshTokenResponseData
    {
        public long Id { get; set; }
        public int UserId { get; set; }
        public string? RefreshToken { get; set; }
        public string? TokenHash { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string? IpAddress { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
