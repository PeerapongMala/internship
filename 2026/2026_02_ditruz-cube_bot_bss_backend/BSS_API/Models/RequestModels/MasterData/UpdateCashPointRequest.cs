using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateCashPointRequest
    {
        [Required]
        public int CashpointId { get; set; }

        [Required]
        public int InstitutionId { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        [MaxLength(150)]
        public string CashpointName { get; set; }

        [Required]
        [MaxLength(10)]
        public string BranchCode { get; set; }

        public bool? IsActive { get; set; }

    }
}
