using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.RequestModels
{
    public class CreateConfigTypeRequest
    {
       
        [Required]
        [MaxLength(50)]
        public string ConfigTypeCode { get; set; }

        [MaxLength(300)]
        public string? ConfigTypeDesc { get; set; }

        public bool? IsActive { get; set; }
         
    }
}
