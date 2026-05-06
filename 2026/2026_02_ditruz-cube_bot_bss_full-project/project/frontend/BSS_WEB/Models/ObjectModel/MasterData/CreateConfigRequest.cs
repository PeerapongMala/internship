using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateConfigRequest
    { 
        public int configTypeId { get; set; } = 0;
        public string configCode { get; set; } = string.Empty;
        public string configValue { get; set; } = string.Empty;
        public string configDesc { get; set; } = string.Empty;
        public bool isActive { get; set; } = false;
    }
}
