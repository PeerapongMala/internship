namespace BSS_API.Models.ObjectModels
{
    public class BssGenerateRefreshTokenResult
    {
        public long Id { get; set; }
        public int UserId { get; set; }
        public string? RefreshToken { get; set; } 
        public string? TokenHash { get; set; }  // เก็บเฉพาะ Hash เท่านั้น ห้ามเก็บ token ตรง ๆ
        public DateTime ExpiresAt { get; set; }
        public string? IpAddress { get; set; } // null
        public bool IsRevoked { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
