using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateConfigRequest:CreateConfigRequest
    {
        public int configId { get; set; } = 0;
     
    }
}
