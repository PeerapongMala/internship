using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateM7QualityRequest
    {
        
        public int m7QualityId { get; set; }

        [MaxLength(15)] 
        public string m7QualityCode { get; set; }

        [MaxLength(50)] 
        public string? m7QualityDescrpt { get; set; }

        [MaxLength(15)] 
        public string? m7QualityCps { get; set; }

       
        public bool isActive { get; set; }
       
        
        public int? updatedBy { get; set; } 
    }
}
