using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_m7denom_series")]
    public class MasterMSevendenomSeries
    {
        [Key]
        [Required]
        [Column("m7denom_series_id")]
        public int MSevendenomSeriesId { get; set; }

        [ForeignKey("bss_mst_m7_denom")]
        [Required]
        [Column("m7_denom_id")]
        public int MSevenDenomId { get; set; }

        [ForeignKey(nameof(MSevenDenomId))]
        public MasterMSevenDenom MasterMSevenDenom { get; set; }

        [ForeignKey("bss_mst_series_denom")]
        [Required]
        [Column("series_denom_id")]
        public int SeriesDenomId { get; set; }

        [ForeignKey(nameof(SeriesDenomId))]
        public MasterSeriesDenom MasterSeriesDenom { get; set; }

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
