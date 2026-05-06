using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateCompanyInstitutionRequest
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
