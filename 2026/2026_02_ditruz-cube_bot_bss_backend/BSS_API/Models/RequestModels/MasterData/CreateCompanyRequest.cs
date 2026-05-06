using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.RequestModels
{
    public class CreateCompanyRequest
    {
        [Required]
        [MaxLength(10)]
        public string CompanyCode { get; set; }

        [Required]
        [MaxLength(100)]
        public string CompanyName { get; set; }

        public bool? IsActive { get; set; }
         
    }
}
