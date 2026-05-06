using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_bn_operation_center")]
    public class MasterDepartment
    {
        [Key]
        [Required]
        [Column("department_id")]
        public int DepartmentId { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("department_code")]
        public string DepartmentCode { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("dept_short_name")]
        public string DepartmentShortName { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("department_name")]
        public string DepartmentName { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        public ICollection<TransactionApiLog> TransactionApiLog { get; set; }
        public ICollection<TransactionUserLoginLog> TransactionUserLoginLog { get; set; }
        public ICollection<MasterUser> MasterUser { get; set; }
        public ICollection<TransactionContainerPrepare> TransactionContainerPrepares { get; set; }
        public ICollection<ReceiveCbmsDataTransaction> ReceiveCbmsDataTransactions { get; set; }
        public ICollection<TransactionRegisterUnsort> TransactionRegisterUnsorts { get; set; }
        public ICollection<TransactionSendUnsortCC> TransactionSendUnsortCCs { get; set; }
        public ICollection<TransactionSendUnsortCCHistory> TransactionSendUnsortCCHistorys { get; set; }
        public ICollection<TransactionReconcileTran> TransactionReconcileTran { get; set; }
    }
}