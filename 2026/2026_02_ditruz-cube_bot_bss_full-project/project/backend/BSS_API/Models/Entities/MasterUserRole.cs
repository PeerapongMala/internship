using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_user_role")]
    public class MasterUserRole
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        [Column("user_role_id")]
        public int UserRoleId { get; set; }

        [Required]
        [Column("user_id")]
        [ForeignKey("MasterUser")]
        public int UserId { get; set; }

        public MasterUser MasterUser { get; set; }

        [Required]
        [Column("role_group_id")]
        [ForeignKey("MasterRoleGroup")]
        public int RoleGroupId { get; set; }

        public MasterRoleGroup MasterRoleGroup { get; set; }

        [Required] [Column("assigned_date")] public DateTime AssignedDateTime { get; set; } = DateTime.Now;

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }
    }
}