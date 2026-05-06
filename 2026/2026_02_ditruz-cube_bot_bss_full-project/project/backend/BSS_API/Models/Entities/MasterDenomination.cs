using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_denomination")]
    public class MasterDenomination
    {
        [Key]
        [Required]
        [Column("deno_id")]
        public int DenominationId { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("deno_code")]
        public int DenominationCode { get; set; }

        [Required]
        [Column("deno_price")]
        public int DenominationPrice { get; set; }

        [MaxLength(20)]
        [Column("deno_descrpt")]
        public string? DenominationDesc { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("deno_currency")]
        public string DenominationCurrency { get; set; }

        [Column("is_active")]
        public bool? IsActive { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")]
        public int? UpdatedBy { get; set; }

        [Column("updated_date")]
        public DateTime? UpdatedDate { get; set; }
        public ICollection<ReceiveCbmsDataTransaction> ReceiveCbmsDataTransactions { get; set; }
        public ICollection<TransactionPreparation> TransactionPreparation { get; set; }
        public ICollection<TransactionUnsortCC> TransactionUnsortCCs { get; set; }
        public ICollection<TransactionUnsortCCHistory> TransactionUnsortCCHistorys { get; set; }

    }
}
