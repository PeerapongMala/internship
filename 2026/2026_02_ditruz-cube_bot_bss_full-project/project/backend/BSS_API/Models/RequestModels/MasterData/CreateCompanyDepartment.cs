using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateCompanyDepartment
    {
        [Required]
        public int CompanyId { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        [Required]
        public string CbBcdCode { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public bool IsSendUnsortCC { get; set; }

        [Required]
        public bool IsPrepareCentral { get; set; }

        public bool? IsActive { get; set; }
         
    }
}
