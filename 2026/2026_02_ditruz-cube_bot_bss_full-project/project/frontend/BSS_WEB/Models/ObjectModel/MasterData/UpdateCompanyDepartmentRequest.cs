using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateCompanyDepartmentRequest : CreateCompanyDepartmentRequest
    { 
        [Required]
        public int ComdeptId { get; set; } 
    }
}
