using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class MasterMenuViewData
    {
        public int MenuId { get; set; }
        public string MenuName { get; set; }
        public string MenuPath { get; set; }
        public int DisplayOrder { get; set; }
        public string ControllerName { get; set; }
        public string ActionName { get; set; }
        public int? ParentMenuId { get; set; }
        public bool? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
