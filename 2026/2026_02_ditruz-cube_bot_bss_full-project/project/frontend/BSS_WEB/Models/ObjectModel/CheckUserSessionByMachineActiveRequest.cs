using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CheckUserSessionByMachineActiveRequest
    {
        [Required]
        public int DepartmentId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int MachineId { get; set; }
    }
}
