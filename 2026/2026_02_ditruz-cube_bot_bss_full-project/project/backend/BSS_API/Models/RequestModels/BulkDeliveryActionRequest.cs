using BSS_API.Models.ObjectModels;

namespace BSS_API.Models.RequestModels
{
    public class BulkDeliveryActionRequest
    {
        public List<int> SendUnsortIds { get; set; } // เปลี่ยนเป็น List
        public int UserId { get; set; }
        public string Note { get; set; }
    }
}
