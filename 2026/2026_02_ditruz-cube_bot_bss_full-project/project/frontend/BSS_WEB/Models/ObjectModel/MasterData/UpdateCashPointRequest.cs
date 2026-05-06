using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateCashPointRequest:CreateCashPointRequest
    {
        public int cashpointId { get; set; } = 0;
        
    }
}
