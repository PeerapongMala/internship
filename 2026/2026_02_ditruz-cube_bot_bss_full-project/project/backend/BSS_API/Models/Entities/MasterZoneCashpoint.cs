using DocumentFormat.OpenXml.Bibliography;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_zone_cashpoint")]
    public class MasterZoneCashpoint
    {
        [Key]
        [Required]
        [Column("zone_cashpoint_id")]
        public int ZoneCashpointId { get; set; }
        
        [Required]
        [Column("zone_id")]
        public int ZoneId { get; set; }
        [ForeignKey(nameof(ZoneId))]
        public MasterZone MasterZone { get; set; }

        [ForeignKey("bss_mst_cashpoint")]
        [Required]
        [Column("cashpoint_id")]
        public int CashpointId { get; set; }

        [ForeignKey(nameof(CashpointId))]
        public MasterCashPoint MasterCashPoint { get; set; }

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
