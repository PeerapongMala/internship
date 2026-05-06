using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateMSevenQualityRequest
    {
       
        [Required]
        [MaxLength(15)]
        public string M7QualityCode { get; set; }

        [MaxLength(50)]
        public string? M7QualityDescrpt { get; set; }

        [MaxLength(15)]
        public string M7QualityCps { get; set; }

        public bool? IsActive { get; set; }

    

    }
}
