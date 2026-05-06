namespace BSS_WEB.Models.ObjectModel
{
    public class CreateStatusRequest
    {
       
        public string statusCode { get; set; } = string.Empty;
        public string statusNameTh { get; set; } = string.Empty;
        public string statusNameEn { get; set; } = string.Empty;
        public bool isActive { get; set; } = false;
        
    }
}
