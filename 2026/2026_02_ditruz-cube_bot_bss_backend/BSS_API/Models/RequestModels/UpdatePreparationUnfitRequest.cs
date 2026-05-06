using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdatePreparationUnfitRequest
    { 
        public string? HeaderCardCode { get; set; } 

        [Required]
        public long PrepareId { get; set; }

        [Required]
        public string Remark { get; set; } = string.Empty;

        public int CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
