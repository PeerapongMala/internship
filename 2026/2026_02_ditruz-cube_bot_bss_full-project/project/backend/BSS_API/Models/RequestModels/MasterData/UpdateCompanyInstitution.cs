using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateCompanyInstitution:CreateMasterCompanyInstitution
    {
         
        [Required]
        public int CompanyInstId { get; set; }
         
         
    }
}
