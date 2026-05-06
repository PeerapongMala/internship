using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateTransOperationLog
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string OperationPage { get; set; }

        [Required]
        [MaxLength(100)]
        public string OperationController { get; set; }

        [Required]
        [MaxLength(100)]
        public string OperationAction { get; set; }

        [Required]
        public string OperationParam { get; set; }

        [Required]
        [MaxLength(30)]
        public string OperationResult { get; set; }

        [MaxLength(500)]
        public string? Remark { get; set; }

        public int? CreatedBy { get; set; }

        //[Required]
        //public DateTime CreatedDate { get; set; }
    }
}
