using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateRemainingQtyRequest
    {
        [Required]
        public List<long> ReceiveIds { get; set; }
    }
}
