using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateCashCenterRequest
    {
        [Required]
        public int CashCenterId { get; set; }

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
