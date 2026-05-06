using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.RequestModels
{
    public class CreateConfigRequest
    {

        [Required]
        public int ConfigTypeId { get; set; }

        [Required]
        [MaxLength(50)]
        public string ConfigCode { get; set; }

        [MaxLength(300)]
        public string? ConfigValue { get; set; }

        [MaxLength(300)]
        public string? ConfigDesc { get; set; }

        public bool? IsActive { get; set; }
         
    }
}
