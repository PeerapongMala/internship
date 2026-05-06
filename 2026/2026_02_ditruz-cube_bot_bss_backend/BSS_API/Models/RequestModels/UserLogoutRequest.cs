using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UserLogoutRequest
    {
        [Required]
        public int UserId { get; set; }
    }
}
