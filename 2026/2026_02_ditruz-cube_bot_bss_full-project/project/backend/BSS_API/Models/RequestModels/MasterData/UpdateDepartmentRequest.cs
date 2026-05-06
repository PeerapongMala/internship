using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateDepartmentRequest
    {
        [Required]
        public int DepartmentId { get; set; }

        [Required]
        [MaxLength(20)]
        public string DepartmentCode { get; set; }

        [Required]
        public string DepartmentShortName { get; set; }

        [Required]
        public string DepartmentName { get; set; }

        public bool? IsActive { get; set; }
         
    }
}
