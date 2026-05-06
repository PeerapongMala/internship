using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{ 
    public class CreateRegisterUnsortRequest
    {
        [Required]
        [MaxLength(10)]
        public string ContainerCode { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        public bool? IsActive { get; set; }

        [Required]
        public int StatusId { get; set; }

        public int? SupervisorReceived { get; set; }

        [Required]
        public DateTime ReceivedDate { get; set; } = DateTime.Now;

        [MaxLength(300)]
        public string Remark { get; set; }

        public int? CreatedBy { get; set; }
    }


}
