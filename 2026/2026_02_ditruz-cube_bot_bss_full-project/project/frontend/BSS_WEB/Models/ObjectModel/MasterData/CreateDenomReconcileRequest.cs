using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateDenomReconcileRequest
    {
     
        [Required]
        public int denoId { get; set; } = 0;
        [Required]
        public int departmentId { get; set; } = 0;
        [Required]
        public string seriesDenomId { get; set; } = string.Empty;
        public int? seqNo { get; set; } = 0;
        public bool isDefault { get; set; } = false;
        public bool isDisplay { get; set; } = false;
        public bool isActive { get; set; } = false;
         
    }
}
