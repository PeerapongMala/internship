using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateBanknoteTypeSendRequest
    {
        public string bssBntypeCode { get; set; } = string.Empty;
        public string banknoteTypeSendCode { get; set; } = string.Empty;
        
        public string banknoteTypeSendDesc { get; set; } = string.Empty;
        public bool isActive { get; set; } = false;

         
        

       
    }
}
