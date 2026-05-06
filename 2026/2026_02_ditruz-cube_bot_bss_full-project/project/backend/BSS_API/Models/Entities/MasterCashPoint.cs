using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_cashpoint")]
    public class MasterCashPoint
    {
        [Key]
        [Required]
        [Column("cashpoint_id")]
        public int CashpointId { get; set; }

        [Required]
        [ForeignKey("bss_mst_institution")]
        [Column("inst_id")]
        public int InstitutionId { get; set; }

        [ForeignKey(nameof(InstitutionId))]
        public MasterInstitution MasterInstitution { get; set; }  
        
        [Required]
        [ForeignKey("bss_mst_bn_operation_center")]
        [Column("department_id")]
        public int DepartmentId { get; set; }

        [ForeignKey(nameof(DepartmentId))]
        public MasterDepartment MasterDepartment { get; set; } 

        [MaxLength(150)]
        [Column("cashpoint_name")]
        public string? CashpointName { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("branch_code")]
        public string BranchCode { get; set; }

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


        
        [MaxLength(10)]
        [Column("cb_bcd_code")]
        public string? CbBcdCode { get; set; }
    }
}
