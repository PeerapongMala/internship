using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateConfigTypeRequest
    {
        [Required]
        public int ConfigTypeId { get; set; }

        [Required]
        [MaxLength(50)]
        public string ConfigTypeCode { get; set; } 

        [MaxLength(300)]
        public string? ConfigTypeDesc { get; set; }

        public bool? IsActive { get; set; }
         
    }
}
