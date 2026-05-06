namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_send_unsort_cc")]
    public class TransactionSendUnsortCC
    {
        public TransactionSendUnsortCC()
        {
            TransactionSendUnsortData = new HashSet<TransactionSendUnsortData>();
        }

        [Key]
        [Required]
        [Column("send_unsort_id")]
        public long SendUnsortId { get; set; }

        [Required]
        [Column("department_id")]
        [ForeignKey("MasterDepartment")]
        public int DepartmentId { get; set; }

        public MasterDepartment? MasterDepartment { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("send_unsort_code")]
        public string SendUnsortCode { get; set; }

        [MaxLength(200)] [Column("remark")] public string? Remark { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("ref_code")]
        public string RefCode { get; set; }

        [MaxLength(10)]
        [Column("old_ref_code")]
        public string? OldRefCode { get; set; }

        [Required]
        [Column("status_id")]
        [ForeignKey("MasterStatus")]
        public int StatusId { get; set; }

        public MasterStatus? MasterStatus { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        [Column("send_date")] public DateTime? SendDate { get; set; }

        [Column("received_date")] public DateTime? ReceivedDate { get; set; }

        public ICollection<TransactionSendUnsortData>? TransactionSendUnsortData { get; set; }

        public TransactionSendUnsortCCHistory? TransactionSendUnsortCCHistory { get; set; }
    }
}