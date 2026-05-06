using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateMasterCompanyInstitution
    {
        [Required]
        public int CompanyId { get; set; }

        [Required]
        public int InstId { get; set; }

        public bool? IsActive { get; set; }

        [Required]
        [MaxLength(10)]
        public string CbBcdCode { get; set; } 
    }
}
