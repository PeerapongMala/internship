using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateInstitutionRequest
    {
        

        [Required]
        [MaxLength(10)]
        public string InstitutionCode { get; set; }

        [Required]
        [MaxLength(10)]
        public string BankCode { get; set; }

        [Required]
        [MaxLength(100)]
        public string InstitutionShortName { get; set; }

        [Required]
        [MaxLength(150)]
        public string InstitutionNameTh { get; set; }

        [MaxLength(100)]
        public string? InstitutionNameEn { get; set; }

        public bool? IsActive { get; set; }

        
    }
}
