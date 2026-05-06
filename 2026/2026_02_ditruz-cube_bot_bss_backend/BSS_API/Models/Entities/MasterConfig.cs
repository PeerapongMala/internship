namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_mst_config")]
    public class MasterConfig
    {
        [Key] [Required] [Column("config_id")] public int ConfigId { get; set; }

        [Required]
        [ForeignKey("ConfigType")]
        [Column("config_type_id")]
        public int ConfigTypeId { get; set; }

        public MasterConfigType? ConfigType { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("config_code")]
        public string ConfigCode { get; set; }

        [MaxLength(300)]
        [Column("config_value")]
        public string? ConfigValue { get; set; }

        [MaxLength(300)]
        [Column("config_descript")]
        public string? ConfigDesc { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }
    }
}