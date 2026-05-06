using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateCashCenterRequest:CreateCashCenterRequest
    {
        public int cashCenterId { get; set; } = 0; 
    }
}
