namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    
    [Table("bss_txn_register_unsort")]
    public class TransactionRegisterUnsort
    {
        [Key]
        [Required]
        [Column("register_unsort_id")]
        public long RegisterUnsortId { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("container_code")]
        public string ContainerCode { get; set; }

        [Required]
        [Column("department_id")]
        [ForeignKey("MasterDepartment")]
        public int DepartmentId { get; set; }

        public MasterDepartment MasterDepartment { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Required]
        [Column("status_id")]
        [ForeignKey("MasterStatus")]
        public int StatusId { get; set; }

        public MasterStatus? MasterStatus { get; set; }

        [Column("supervisor_received")] public int? SupervisorReceived { get; set; }

        [Required] [Column("received_date")] public DateTime ReceivedDate { get; set; } = DateTime.Now;

        [MaxLength(300)] [Column("remark")] public string? Remark { get; set; }

        [Column("created_by")]
        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public MasterUser? CreatedUser { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        public ICollection<TransactionUnsortCC> TransactionUnsortCCs { get; set; }

        public TransactionSendUnsortData TransactionSendUnsortData { get; set; }

        public ICollection<TransactionSendUnsortDataHistory> TransactionSendUnsortDataHistorys { get; set; }
    }
}