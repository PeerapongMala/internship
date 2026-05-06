using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.RequestModels
{
    public class CreateMachineRequest
    {
        [Required]
        public int DepartmentId { get; set; }

        [Required]
        public int MachineTypeId { get; set; }

        [Required]
        [MaxLength(20)]
        public string MachineCode { get; set; }

        [Required]
        [MaxLength(30)]
        public string MachineName { get; set; }

        public int? HcLength { get; set; }

        [MaxLength(300)]
        public string? PathnameBss { get; set; }
        [MaxLength(300)]
        public string? PathnameCompleted { get; set; }
        [MaxLength(300)]
        public string? PathnameError { get; set; } 
        public bool? IsEmergency { get; set; }

        public bool? IsActive { get; set; }
         
        
    }
}
