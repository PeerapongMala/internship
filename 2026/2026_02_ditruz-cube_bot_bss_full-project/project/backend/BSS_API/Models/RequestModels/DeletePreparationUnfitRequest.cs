using BSS_API.Helpers;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class DeletePreparationUnfitRequest
    {

        [Range(1, long.MaxValue, ErrorMessage = "PrepareId must be greater than 0.")]
        public long PrepareId { get; set; }

        [Required(ErrorMessage = "Remark is required.")] 
        public string Remark { get; set; } = string.Empty;

        public int? UpdatedBy { get; set; }
    }
}
