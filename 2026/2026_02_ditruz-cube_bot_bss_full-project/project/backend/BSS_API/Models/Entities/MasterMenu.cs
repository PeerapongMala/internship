using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_menu")]
    public class MasterMenu
    {
        [Key]
        [Required]
        [Column("menu_id")]
        public int MenuId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("menu_name")]
        public string MenuName { get; set; }

        [Required]
        [MaxLength(500)]
        [Column("menu_path")]
        public string MenuPath { get; set; }

        [Required]
        [Column("display_order")]
        public int DisplayOrder { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("controller_name")]
        public string ControllerName { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("action_name")]
        public string ActionName { get; set; }

        [Column("parent_menu_id")]
        public int? ParentMenuId { get; set; }
        
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
