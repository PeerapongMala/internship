using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_txn_unsort_cc_history")]
    public class TransactionUnsortCCHistory
    {
        [Key]
        [Required]
        [Column("his_cc_id")]
        public long HisCcId { get; set; }

        [Required]
        [Column("his_data_id")]
        [ForeignKey("TransactionSendUnsortDataHistory")]
        public long HisDataId { get; set; }

        public TransactionSendUnsortDataHistory TransactionSendUnsortDataHistory { get; set; }

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

        [Required]
        [Column("banknote_qty")]
        public int BanknoteQty { get; set; }

        [Required]
        [Column("remaining_qty")]
        public int RemainingQty { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")]
        public int? UpdatedBy { get; set; }

        [Column("updated_date")]
        public DateTime? UpdatedDate { get; set; }
    }
}
