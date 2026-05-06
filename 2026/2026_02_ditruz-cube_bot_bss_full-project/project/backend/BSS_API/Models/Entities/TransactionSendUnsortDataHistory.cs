using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_txn_send_unsort_data_history")]
    public class TransactionSendUnsortDataHistory
    {
        [Key]
        [Required]
        [Column("his_data_id")]
        public long HisDataId { get; set; }

        [Required]
        [Column("his_unsort_id")]
        [ForeignKey("TransactionSendUnsortCCHistory")]
        public long HisUnsortId { get; set; }

        public TransactionSendUnsortCCHistory TransactionSendUnsortCCHistory { get; set; }

        [Required]
        [Column("register_unsort_id")]
        [ForeignKey("TransactionRegisterUnsort")]
        public long RegisterUnsortId { get; set; }

        public TransactionRegisterUnsort? TransactionRegisterUnsort { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("container_code")]
        public string ContainerCode { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")]
        public int? UpdatedBy { get; set; }

        [Column("updated_date")]
        public DateTime? UpdatedDate { get; set; }
        public ICollection<TransactionUnsortCCHistory>? TransactionUnsortCCHistorys { get; set; }
    }
}
