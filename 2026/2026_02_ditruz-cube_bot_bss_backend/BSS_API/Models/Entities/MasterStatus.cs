namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_mst_status")]
    public class MasterStatus
    {
        [Key] [Required] [Column("status_id")] public int StatusId { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("status_code")]
        public string StatusCode { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("status_name_th")]
        public string StatusNameTh { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("status_name_en")]
        public string StatusNameEn { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }
        public ICollection<TransactionPreparation> TransactionPreparation { get; set; }

        public ICollection<TransactionRegisterUnsort> TransactionRegisterUnsorts { get; set; }

        public ICollection<TransactionSendUnsortCC> TransactionSendUnsortCCs { get; set; }

        public ICollection<TransactionReconcileTran> TransactionReconcileTran { get; set; }
    }
}