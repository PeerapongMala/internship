namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_send_unsort_data")]
    public class TransactionSendUnsortData
    {
        [Key]
        [Required]
        [Column("send_data_id")]
        public long SendDataId { get; set; }

        [Required]
        [Column("send_unsort_id")]
        [ForeignKey("TransactionSendUnsortCC")]
        public long SendUnsortId { get; set; }

        public TransactionSendUnsortCC? TransactionSendUnsortCC { get; set; }

        [Required]
        [Column("register_unsort_id")]
        [ForeignKey("TransactionRegisterUnsort")]
        public long RegisterUnsortId { get; set; }

        public TransactionRegisterUnsort? TransactionRegisterUnsort { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }
    }
}