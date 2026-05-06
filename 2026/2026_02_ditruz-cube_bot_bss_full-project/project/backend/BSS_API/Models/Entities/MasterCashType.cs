using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_cashtype")]
    public class MasterCashType
    {
        [Key]
        [Required]
        [Column("cashtype_id")]
        public int CashTypeId { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("cashtype_code")]
        public string CashTypeCode { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("cashtype")]
        public string CashTypeName { get; set; }

        [MaxLength(30)]
        [Column("cashtype_descrpt")]
        public string? CashTypeDesc { get; set; }

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
