namespace BSS_API.Models.Entities
{
    using Microsoft.EntityFrameworkCore.Metadata.Internal;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_mst_company_department")]
    public class MasterCompanyDepartment
    {
        [Key]
        [Required]
        [Column("com_dept_id")]
        public int ComdeptId { get; set; }

        [Required] [Column("company_id")] public int CompanyId { get; set; }

        [ForeignKey(nameof(CompanyId))]
        public MasterCompany MasterCompany { get; set; }

        [Required] [Column("department_id")] public int DepartmentId { get; set; }
        [ForeignKey(nameof(DepartmentId))]
        public MasterDepartment MasterDepartment { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("cb_bcd_code")]
        public string CbBcdCode { get; set; }

        [Required] [Column("start_date")] public DateTime StartDate { get; set; } = DateTime.Now;

        [Required] [Column("end_date")] public DateTime EndDate { get; set; } = DateTime.Now;

        [Required]
        [Column("is_send_unsort_cc")]
        public bool IsSendUnsortCC { get; set; }

        [Required]
        [Column("is_prepare_central")]
        public bool IsPrepareCentral { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }
    }
}