using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateCashPointRequest
    {

        [Required]
        public int InstitutionId { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        [MaxLength(150)]
        public string? CashpointName { get; set; }

        [Required]
        [MaxLength(10)]
        public string BranchCode { get; set; }

        public bool? IsActive { get; set; }

        [Required]
        [MaxLength(10)]
        public string CbBcdCode { get; set; }

    }
}
