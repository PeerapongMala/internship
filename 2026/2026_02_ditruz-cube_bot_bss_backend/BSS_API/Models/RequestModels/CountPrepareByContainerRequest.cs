using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CountPrepareByContainerRequest
    {
        [Required]
        public int DepartmentId { get; set; }

        [Required]
        [MaxLength(20)]
        public string ContainerId { get; set; }

        [Required] 
        public string BssBNTypeCode { get; set; }
    }
}
