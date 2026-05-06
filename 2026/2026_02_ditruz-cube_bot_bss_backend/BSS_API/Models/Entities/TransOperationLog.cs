using DocumentFormat.OpenXml.Wordprocessing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_txn_operation_log")]
    public class TransOperationLog
    {
        [Key]
        [Required]
        [Column("operation_log_id")]
        public int OperationLogId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("operation_page")]
        [MaxLength(100)]
        public string OperationPage { get; set; }

        [Required]
        [Column("operation_controller")]
        [MaxLength(100)]
        public string OperationController { get; set; }

        [Required]
        [Column("operation_action")]
        [MaxLength(100)]
        public string OperationAction { get; set; }

        [Required]
        [Column("operation_param", TypeName = "nvarchar(MAX)")]
        public string OperationParam { get; set; }

        [Required]
        [Column("operation_result")]
        [MaxLength(30)]
        public string OperationResult { get; set; }

        [Column("remark")]
        [MaxLength(500)]
        public string? Remark { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }

        [Column("updated_by")]
        public int? UpdatedBy { get; set; }

        [Column("updated_date")]
        public DateTime? UpdatedDate { get; set; }

    }
}
