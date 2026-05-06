using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class LogoutAndRevokeRequest
    {
        [Required]
        public string RefreshToken { get; set; }
    }
}
