using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_role_group")]
    public class MasterRoleGroup
    {
        [Key]
        [Required]
        [Column("role_group_id")]
        public int RoleGroupId { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("role_group_code")]
        public string RoleGroupCode { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("role_group_name")]
        public string RoleGroupName { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        public ICollection<MasterRole> MasterRole { get; set; }

        public ICollection<MasterUserRole> MasterUserRole { get; set; }
    }
}