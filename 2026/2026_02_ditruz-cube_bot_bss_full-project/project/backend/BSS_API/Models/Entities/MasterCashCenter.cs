using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_cashcenter")]
    public class MasterCashCenter
    {
        [Key]
        [Required]
        [Column("cashcenter_id")]
        public int CashCenterId { get; set; }

        [Required]
        [ForeignKey("bss_mst_bn_operation_center")]
        [Column("department_id")]
        public int DepartmentId { get; set; }

        [ForeignKey(nameof(DepartmentId))]
        public MasterDepartment MasterDepartment { get; set; } 

        [Required]
        [ForeignKey("bss_mst_institution")]
        [Column("inst_id")]
        public int InstitutionId { get; set; }
        [ForeignKey(nameof(InstitutionId))]
        public MasterInstitution MasterInstitution { get; set; }  

        [Required]
        [MaxLength(10)]
        [Column("cashcenter_code")]
        public string CashCenterCode { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("cashcenter_name")]
        public string CashCenterName { get; set; }

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
        public ICollection<TransactionPreparation> TransactionPreparation { get; set; }

    }
}
