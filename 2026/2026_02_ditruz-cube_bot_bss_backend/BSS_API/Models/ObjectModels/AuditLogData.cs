namespace BSS_API.Models.ObjectModels
{
    public class AuditLogData
    {
        public int? UserId { get; set; }
        public string? Controller { get; set; }
        public string? Action { get; set; }
        public string? RequestBody { get; set; }
        public int StatusCode { get; set; }
        public string? ErrorMessage { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public string? RequestId { get; set; }
    }
}
