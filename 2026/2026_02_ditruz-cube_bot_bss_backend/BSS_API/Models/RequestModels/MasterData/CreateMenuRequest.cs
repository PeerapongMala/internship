using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateMenuRequest
    {
        [Required]
        [MaxLength(100)]
        public string MenuName { get; set; }

        [Required]
        [MaxLength(500)]
        public string MenuPath { get; set; }

        [Required]
        public int DisplayOrder { get; set; }

        [Required]
        [MaxLength(100)]
        public string ControllerName { get; set; }

        [Required]
        [MaxLength(100)]
        public string ActionName { get; set; }

        public int? ParentMenuId { get; set; }

        public bool? IsActive { get; set; }

    }
}
