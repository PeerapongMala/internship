using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateMSevenOutputRequest
    {
        [Required]
        public int MSevenOutputId { get; set; }

        [Required]
        [MaxLength(10)]
        public string MSevenOutputCode { get; set; }

        [MaxLength(50)]
        public string? MSevenOutputDescrpt { get; set; }

        public bool? IsActive { get; set; }

       
    }
}
