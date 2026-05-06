using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class ValidateTransactionUnSortCcRequest
    {
        [Required]
        public int DepartmentId { get; set; }

        [Required]
        public string ContainerId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public int CompanyId { get; set; }
    }
}
