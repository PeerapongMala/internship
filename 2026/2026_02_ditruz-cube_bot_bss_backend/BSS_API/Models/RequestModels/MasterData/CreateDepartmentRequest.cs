using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateDepartmentRequest
    {
        [Required]
        [MaxLength(10)]
        public string DepartmentCode { get; set; }

        [Required]
        [MaxLength(5)]
        public string DepartmentShortName { get; set; }

        [Required]
        [MaxLength(100)]
        public string DepartmentName { get; set; }

        public bool? IsActive { get; set; }
         

    }
}
