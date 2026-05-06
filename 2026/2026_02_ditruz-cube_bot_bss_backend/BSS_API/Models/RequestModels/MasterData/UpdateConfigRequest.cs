using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateConfigRequest
    {
        [Required]
        public int ConfigId { get; set; }

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
