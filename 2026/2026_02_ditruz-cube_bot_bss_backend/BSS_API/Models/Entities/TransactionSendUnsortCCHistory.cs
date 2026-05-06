namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_send_unsort_cc_history")]
    public class TransactionSendUnsortCCHistory
    {
        public TransactionSendUnsortCCHistory()
        {
            TransactionSendUnsortDataHistory = new HashSet<TransactionSendUnsortDataHistory>();
        }

        [Key]
        [Required]
        [Column("his_unsort_id")]
        public long HisUnsortId { get; set; }

        [Required]
        [Column("department_id")]
        [ForeignKey("MasterDepartment")]
        public int DepartmentId { get; set; }

        public MasterDepartment? MasterDepartment { get; set; }

        [Required]
        [Column("send_unsort_id")]
        [ForeignKey("TransactionSendUnsortCC")]
        public long SendUnsortId { get; set; }

        public TransactionSendUnsortCC? TransactionSendUnsortCC { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("send_unsort_code")]
        public string SendUnsortCode { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("ref_code")]
        public string RefCode { get; set; }

        [MaxLength(10)]
        [Column("old_ref_code")]
        public string? OldRefCode { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        public ICollection<TransactionSendUnsortDataHistory>? TransactionSendUnsortDataHistory { get; set; }
    }
}