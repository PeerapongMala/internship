using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_role")]
    public class MasterRole
    {
        [Key]
        [Required]
        [Column("role_id")]
        public int RoleId { get; set; }

        [Required]
        [Column("role_group_id")]
        [ForeignKey("MasterRoleGroup")]
        public int RoleGroupId { get; set; }
        
        public MasterRoleGroup MasterRoleGroup { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("role_code")]
        public string RoleCode { get; set; }
        
        [Required]
        [MaxLength(50)]
        [Column("role_name")]
        public string RoleName { get; set; }

        [MaxLength(100)]
        [Column("role_descript")]
        public string? RoleDescription { get; set; }

        [Column("seq_no")]
        public int? SeqNo { get; set; }

        [Column("is_get_otp_sup")]
        public bool? IsGetOtpSupervisor { get; set; }

        [Column("is_get_otp_man")]
        public bool? IsGetOtpManager { get; set; }

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
