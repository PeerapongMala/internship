using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateDenomReconcileRequest:CreateDenomReconcileRequest
    {
        [Required]
        public int denomReconcileId { get; set; } = 0;
        
    }
}
