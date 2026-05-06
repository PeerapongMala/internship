namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_mst_config_type")]
    public class MasterConfigType
    {
        public MasterConfigType()
        {
            Configs = new HashSet<MasterConfig>();
        }

        [Key] [Column("config_type_id")] public int ConfigTypeId { get; set; }

        [MaxLength(50)]
        [Column("config_type_code")]
        public required string ConfigTypeCode { get; set; }

        [MaxLength(300)]
        [Column("config_type_descrpt")]
        public string? ConfigTypeDesc { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Column("created_date")] public required DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        public ICollection<MasterConfig>? Configs { get; set; }
    }
}