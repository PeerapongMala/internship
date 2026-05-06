using BSS_API.Models.ObjectModels;

namespace BSS_API.Models.RequestModels
{
    public class UpdateRemainingQtyReceiveRequest
    {
        public int RemainingQty { get; set; }
        public int RegisterUnsortId { get; set; }
        public int InstId { get; set; }
        public int DenoId { get; set; }
        public int CreatedBy { get; set; }
        public int DepartmentId { get; set; }
    }
}
