using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class MasterMenuActiveData
    {
        public int MenuId { get; set; }
        public string MenuName { get; set; }
        public int DisplayOrder { get; set; }
        public int? ParentMenuId { get; set; }
    }
}
