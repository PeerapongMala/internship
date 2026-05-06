using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class SearchUserForRegisterRequest
    {
        [Required]
        public int CompanyId { get; set; }

        [Required]
        public string UserNameInput { get; set; }

        [Required]
        public int CreateBy { get; set; }
    }
}
