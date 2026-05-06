using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_institution")]
    public class MasterInstitution
    {
        [Key]
        [Required]
        [Column("inst_id")]
        public int InstitutionId { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("inst_code")]
        public string InstitutionCode { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("bank_code")]
        public string BankCode { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("inst_short_name")]
        public string InstitutionShortName { get; set; }

        [Required]
        [MaxLength(150)]
        [Column("inst_name_th")]
        public string InstitutionNameTh { get; set; }

        [MaxLength(100)]
        [Column("inst_name_en")]
        public string? InstitutionNameEn { get; set; }

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
