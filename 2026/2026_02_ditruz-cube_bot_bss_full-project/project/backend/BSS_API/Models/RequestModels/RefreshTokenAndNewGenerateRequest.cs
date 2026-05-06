using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class RefreshTokenAndNewGenerateRequest
    {
        [Required]
        public string RefreshToken { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int DepartmentId { get; set; }
    }
}
