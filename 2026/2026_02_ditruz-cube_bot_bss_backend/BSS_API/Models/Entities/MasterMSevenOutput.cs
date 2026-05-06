using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_m7output")]
    public class MasterMSevenOutput
    {
        [Key]
        [Required]
        [Column("m7output_id")]
        public int MSevenOutputId { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("m7output_code")]
        public string MSevenOutputCode { get; set; }

        [MaxLength(50)]
        [Column("m7output_descrpt")]
        public string? MSevenOutputDescrpt { get; set; }

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
