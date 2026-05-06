using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_role_permission")]
    public class MasterRolePermission
    {

        [Key]
        [Required]
        [Column("role_permission_id")]
        public int RolePermissionId { get; set; }

        [Required]
        [ForeignKey("bss_mst_role")]
        [Column("role_id")]
        public int RoleId { get; set; }

        [Required]
        [ForeignKey("bss_mst_menu")]
        [Column("menu_id")]
        public int MenuId { get; set; }

        [Required]
        [Column("assigned_date")]
        public DateTime AssignedDateTime { get; set; } = DateTime.Now;

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
