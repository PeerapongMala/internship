using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateStatusRequest
    {
       
        [Required]
        [MaxLength(10)]
        public string StatusCode { get; set; }

        [Required]
        [MaxLength(20)]
        public string StatusNameTh { get; set; }

        [Required]
        [MaxLength(20)]
        public string StatusNameEn { get; set; }

        public bool? IsActive { get; set; }
         
    }
}
