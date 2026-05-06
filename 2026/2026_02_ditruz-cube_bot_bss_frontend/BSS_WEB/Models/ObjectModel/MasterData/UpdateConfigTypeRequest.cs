using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateConfigTypeRequest:CreateConfigTypeRequest
    {
        public int configTypeId { get; set; } = 0;
       
    }
}
