using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_company_institution")]
    public class MasterCompanyInstitution
    {
        [Key]
        [Required]
        [Column("company_inst_id")]
        public int CompanyInstId { get; set; }

         
        [Required]
        [Column("company_id")]
        public int CompanyId { get; set; }


        [ForeignKey(nameof(CompanyId))]
        public MasterCompany MasterCompany { get; set; }


        [Required]        
        [Column("inst_id")]
        public int InstId { get; set; }

        [ForeignKey(nameof(InstId))]
        public MasterInstitution MasterInstitution { get; set; }

        
        [MaxLength(10)]
        [Column("cb_bcd_code")]
        public string? CbBcdCode { get; set; }

        [Column("is_active")]
        public bool? IsActive { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }

        [Column("updated_by")]
        public int? UpdatedBy { get; set; }

        [Column("updated_date")]
        public DateTime? UpdatedDate { get; set; }
    }
}
