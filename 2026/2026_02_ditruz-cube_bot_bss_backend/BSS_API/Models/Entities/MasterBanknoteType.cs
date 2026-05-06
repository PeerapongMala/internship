using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_bn_type")]

    public class MasterBanknoteType
    {
        [Key]
        [Required]
        [Column("bntype_id")]
        public int BanknoteTypeId { get; set; }

        [Required]
        [MaxLength(3)]
        [Column("bntype_code")]
        public string BanknoteTypeCode { get; set; }

        [Required]
        [MaxLength(3)]
        [Column("bss_bntype_code")]
        public string BssBanknoteTypeCode { get; set; }

        [Required]
        [MaxLength(30)]
        [Column("bntype_name")]
        public string BanknoteTypeName { get; set; }

        [MaxLength(50)]
        [Column("bntype_descrpt")]
        public string? BanknoteTypeDesc { get; set; }

        [Column("is_display")]
        public bool? IsDisplay { get; set; }

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
        public ICollection<TransactionContainerPrepare> TransactionContainerPrepares { get; set; }


    }
}
