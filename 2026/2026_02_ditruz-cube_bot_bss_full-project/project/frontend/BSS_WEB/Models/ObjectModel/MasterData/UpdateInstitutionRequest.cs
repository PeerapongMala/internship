using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateInstitutionRequest:CreateInstitutionRequest
    {
        [Required]
        public int InstitutionId { get; set; }
        

    }
}
