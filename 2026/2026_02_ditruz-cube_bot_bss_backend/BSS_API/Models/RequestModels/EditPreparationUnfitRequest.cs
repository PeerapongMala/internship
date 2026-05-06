using BSS_API.Helpers;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class EditPreparationUnfitRequest
    {

        [Range(1, long.MaxValue, ErrorMessage = "PrepareId must be greater than 0.")]
        public long PrepareId { get; set; }
        public string? HeaderCardCode { get; set; }  
        [Required(ErrorMessage = "Remark is required.")] 
        public string Remark { get; set; } = string.Empty;

        [Required(ErrorMessage = "UpdatedBy is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "UpdatedBy must be greater than 0.")]
        public int UpdatedBy { get; set; }

        [Required(ErrorMessage = "CreatedBy is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "CreatedBy must be greater than 0.")]
        public int Createdby { get; set; }
    }
}
