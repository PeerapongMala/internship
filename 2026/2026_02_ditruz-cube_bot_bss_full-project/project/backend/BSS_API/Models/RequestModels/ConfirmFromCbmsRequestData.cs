using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class ConfirmFromCbmsRequestData
    {
        [Required]
        [MaxLength(5)]
        public string bdc_code { get; set; }


        [Required]
        [MaxLength(15)]
        public string reference_code { get; set; }

        [Required]
        [MaxLength(3)]
        public string result_session { get; set; }
    }
}
