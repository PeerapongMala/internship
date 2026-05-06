
namespace BSS_WEB.Models.ObjectModel
{
    public class CreateCashTypeRequest
    { 
        public string cashTypeCode { get; set; } = string.Empty;
        public string cashTypeName { get; set; } = string.Empty;
        public string cashTypeDesc { get; set; } = string.Empty;
        public bool isActive { get; set; } = false;
    }
}
