using Microsoft.AspNetCore.Http.HttpResults;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_m7_denom")]
    public class MasterMSevenDenom
    {
        [Key]
        [Required]
        [Column("m7_denom_id")]
        public int M7DenomId { get; set; }

        [Required]
        [ForeignKey("bss_mst_denomination")]
        [Column("deno_id")]
        public int DenoId { get; set; }

        [ForeignKey(nameof(DenoId))]
        public MasterDenomination MasterDenomination { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("m7_denom_code")]
        public string M7DenomCode { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("m7_denom_name")]
        public string M7DenomName { get; set; }

        [MaxLength(30)]
        [Column("m7_denom_descrpt")]
        public string M7DenomDescrpt { get; set; }

        [MaxLength(10)]
        [Column("m7_denom_bms")]
        public string M7DenomBms { get; set; }

        [MaxLength(10)]
        [Column("m7_dn_bms")]
        public string? M7DnBms { get; set; }

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

 
        [Column("series_denom_id")]
        public int SeriesDenomId { get; set; }
        [ForeignKey(nameof(SeriesDenomId))]
        public MasterSeriesDenom MasterSeriesDenom { get; set; }

    }
}
