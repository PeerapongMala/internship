namespace BSS_API.Models.RequestModels
{
    public class MasterConfigTypeRequest
    { 
        public int? ConfigTypeId { get; set; }
        public string ConfigTypeCode { get; set; }=string.Empty;
        public bool? IsActive { get; set; }
    }
}
