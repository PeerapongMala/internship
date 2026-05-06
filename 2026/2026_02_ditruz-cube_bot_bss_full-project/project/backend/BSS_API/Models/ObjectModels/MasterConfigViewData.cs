using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class MasterConfigViewData
    {
        public int ConfigTypeId { get; set; }

        public string? ConfigTypeDesc { get; set; }

        public int ConfigId { get; set; }

        public string ConfigCode { get; set; }

        public string? ConfigValue { get; set; }

        public string? ConfigDesc { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
