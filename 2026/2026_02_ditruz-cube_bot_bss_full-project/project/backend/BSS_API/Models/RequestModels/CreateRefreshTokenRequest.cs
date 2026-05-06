using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateRefreshTokenRequest
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        public string? IpAddress { get; set; }
    }
}
