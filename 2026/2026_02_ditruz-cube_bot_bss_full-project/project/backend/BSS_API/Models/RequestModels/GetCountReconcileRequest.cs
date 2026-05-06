using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class GetCountReconcileRequest
    {        
        [Required]
        public int DepartmentId { get; set; }

        [Required]
        public string PrepareCentral { get; set; }

        [Required]
        public string BnTypeCode { get; set; }

        [Required]
        public DateTime DateTimeStart { get; set; }

        [Required]
        public DateTime DateTimeEnd { get; set; }

        public int MachineId { get; set; } = 0;
    }
}
