using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.RequestModels
{
    public class CreateMSevenOutputRequest
    {
        
        [Required]
        [MaxLength(10)]
        public string MSevenOutputCode { get; set; }

        [MaxLength(50)]
        public string? MSevenOutputDescrpt { get; set; }

        public bool? IsActive { get; set; }
         
    }
}
