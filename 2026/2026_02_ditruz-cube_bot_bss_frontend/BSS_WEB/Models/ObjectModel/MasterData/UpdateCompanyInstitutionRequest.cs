using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateCompanyInstitutionRequest : CreateCompanyInstitutionRequest
    { 
        [Required]
        public int CompanyInstId { get; set; } 
    }
}
