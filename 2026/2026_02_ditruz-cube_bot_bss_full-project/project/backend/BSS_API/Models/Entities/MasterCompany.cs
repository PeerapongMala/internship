using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.Entities
{
                
    [Table("bss_mst_company")]
    public class MasterCompany
    {
        [Key]
        [Required]
        [Column("company_id")]
        public int CompanyId { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("company_code")]
        public string CompanyCode { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("company_name")]
        public string CompanyName { get; set; }

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

        
        public ICollection<MasterCompanyInstitution> MasterCompanyInstitution { get; set; }
    }
}







