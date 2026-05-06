using BSS_API.Models.ObjectModels;

namespace BSS_API.Models.RequestModels
{
    public class DeliveryActionRequest
    {
        public int SendUnsortId { get; set; }
        public int UserId { get; set; }
        public string? Note { get; set; }
    }
}
