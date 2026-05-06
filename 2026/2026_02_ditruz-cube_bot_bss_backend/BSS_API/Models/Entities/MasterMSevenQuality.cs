using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_m7_quality")]

    public class MasterMSevenQuality
    {
        [Key]
        [Required]
        [Column("m7_quality_id")]
        public int M7QualityId { get; set;}

        [Required]
        [MaxLength(15)]
        [Column("m7_quality_code")]
        public string M7QualityCode { get; set; }

        [MaxLength(50)]
        [Column("m7_quality_descrpt")]
        public string? M7QualityDescrpt { get; set; }

        [MaxLength(15)]
        [Column("m7_quality_cps")]
        public string? M7QualityCps { get; set; }

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

    }
}
