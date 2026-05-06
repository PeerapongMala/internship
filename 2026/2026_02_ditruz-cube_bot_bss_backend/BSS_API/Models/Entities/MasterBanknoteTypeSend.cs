using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_bn_type_send")]
    public class MasterBanknoteTypeSend
    {
        [Key]
        [Required]
        [Column("bntype_send_id")]
        public int BanknoteTypeSendId { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("bntype_send_code")]
        public string BanknoteTypeSendCode { get; set; }

        [MaxLength(10)]
        [Column("bss_bntype_code")]
        public string BssBntypeCode { get; set; }

        [MaxLength(50)]
        [Column("bntype_send_descrpt")]
        public string? BanknoteTypeSendDesc { get; set; }

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
