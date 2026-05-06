using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateCompanyRequest
    {
        public string companyCode { get; set; } = string.Empty;
        public string companyName { get; set; } = string.Empty;
        public bool isActive { get; set; } = false;
       
    }
}
