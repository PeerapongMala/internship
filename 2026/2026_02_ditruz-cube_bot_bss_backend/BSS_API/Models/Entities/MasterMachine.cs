using DocumentFormat.OpenXml.Bibliography;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_machine")]
    public class MasterMachine
    {
        [Key]
        [Required]
        [Column("machine_id")]
        public int MachineId { get; set; }

        [Required]
        [ForeignKey("bss_mst_bn_operation_center")]
        [Column("department_id")]
        public int DepartmentId { get; set; }

        [ForeignKey(nameof(DepartmentId))]
        public MasterDepartment MasterDepartment { get; set; }

        [Required]
        [ForeignKey("bss_mst_machine_type")]
        [Column("machine_type_id")]
        public int MachineTypeId { get; set; }

        [ForeignKey(nameof(MachineTypeId))]
        public MasterMachineType MasterMachineType { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("machine_code")]
        public string MachineCode { get; set; }

        [Required]
        [MaxLength(30)]
        [Column("machine_name")]
        public string MachineName { get; set; }

        [Column("hc_length")] public int? HcLength { get; set; }

        [MaxLength(300)]
        [Column("pathname_bss")]
        public string? PathnameBss { get; set; }

        [MaxLength(300)]
        [Column("pathname_completed")]
        public string? PathnameCompleted { get; set; 
        }
        [MaxLength(300)]
        [Column("pathname_error")]
        public string? PathnameError { get; set; }
        [Column("is_emergency")] public bool? IsEmergency { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }
        
        public ICollection<TransactionUserLoginLog> TransactionUserLoginLog { get; set; }

        public ICollection<TransactionContainerPrepare> TransactionContainerPrepares { get; set; }

        public ICollection<TransactionReconcileTran> TransactionReconcileTran { get; set; }
    }
}