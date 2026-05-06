using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.RequestModels
{
    public class CreateCashCenterRequest
    {
       
        [Required]
        public int InstitutionId { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        [Required]
        [MaxLength(10)]
        public string CashCenterCode { get; set; }

        [Required]
        [MaxLength(100)]
        public string CashCenterName { get; set; }


        public bool? IsActive { get; set; }
         
    }
}
