using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class DeliveryCbmsRequestData
    {

        [Required]
        [MaxLength(10)]
        public string request_date { get; set; }

        [Required]
        [MaxLength(15)]
        public string machine_id { get; set; }

    }
}
