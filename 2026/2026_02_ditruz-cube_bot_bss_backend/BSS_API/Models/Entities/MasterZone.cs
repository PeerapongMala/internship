using DocumentFormat.OpenXml.Bibliography;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_zone")]
    public class MasterZone
    {
        [Key]
        [Required]
        [Column("zone_id")]
        public int ZoneId { get; set; }

        [ForeignKey("bss_mst_bn_operation_center")]
        [Required]
        [Column("department_id")]
        public int? DepartmentId { get; set; }
        [ForeignKey(nameof(DepartmentId))]
        public MasterDepartment MasterDepartment { get; set; }

        [ForeignKey("bss_mst_institution")]
        
        [Column("inst_id")]
        public int? InstId { get; set; }

        [ForeignKey(nameof(InstId))]
        public MasterInstitution MasterInstitution { get; set; }

        [Required]
        [Column("zone_code")]
        [MaxLength(5)]
        public string ZoneCode { get; set; }

        [Required]
        [Column("zone_name")]
        [MaxLength(100)]
        public string ZoneName { get; set; }

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
        public ICollection<TransactionPreparation> TransactionPreparation { get; set; }


        [MaxLength(10)]
        [Column("cb_bcd_code")]
        public string? CbBcdCode { get; set; }
    }
}
