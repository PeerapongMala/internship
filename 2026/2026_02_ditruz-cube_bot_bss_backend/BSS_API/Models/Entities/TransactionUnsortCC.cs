namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_unsort_cc")]
    public class TransactionUnsortCC
    {
        [Key]
        [Required]
        [Column("unsort_cc_id")]
        public long UnsortCCId { get; set; }

        [Required]
        [Column("register_unsort_id")]
        [ForeignKey("TransactionRegisterUnsort")]
        public long RegisterUnsortId { get; set; }

        public TransactionRegisterUnsort TransactionRegisterUnsort { get; set; }

        [Required]
        [Column("inst_id")]
        [ForeignKey("MasterInstitution")]
        public int InstId { get; set; }

        public MasterInstitution? MasterInstitution { get; set; }

        [Required]
        [Column("deno_id")]
        [ForeignKey("MasterDenomination")]
        public int DenoId { get; set; }

        public MasterDenomination? MasterDenomination { get; set; }

        [Required] [Column("banknote_qty")] public int BanknoteQty { get; set; }

        [Required] [Column("remaining_qty")] public int RemainingQty { get; set; }

        [Column("adjust_qty")] public int? AdjustQty { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")]
        [ForeignKey("CreatedByUser")]
        public int? CreatedBy { get; set; }

        public MasterUser? CreatedByUser { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        public ICollection<TransactionPreparation>? TransactionPreparation { get; set; }
    }
}