using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateConfigTypeRequest
    { 
        public string configTypeCode { get; set; } = string.Empty;
        public string configTypeDesc { get; set; } = string.Empty;
        public bool isActive { get; set; } = false;
    }
}
