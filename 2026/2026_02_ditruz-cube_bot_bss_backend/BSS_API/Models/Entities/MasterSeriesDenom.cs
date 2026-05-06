using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_series_denom")]
    public class MasterSeriesDenom
    {
        [Key]
        [Required]
        [Column("series_denom_id")]
        public int SeriesDenomId { get; set; }

        [Required]
        [Column("series_code")]
        [MaxLength(5)]
        public string SeriesCode { get; set; }

        [Required]
        [Column("series_descrpt")]
        [MaxLength(50)]
        public string SerieDescrpt { get; set; }

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
