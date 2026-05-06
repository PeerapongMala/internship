using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ServiceModel.ReceiveCbmsTransaction
{
    public class UpdateRemainingQtyRequest
    {
        [Required]
        public List<long> receiveIds { get; set; }
    }
}
