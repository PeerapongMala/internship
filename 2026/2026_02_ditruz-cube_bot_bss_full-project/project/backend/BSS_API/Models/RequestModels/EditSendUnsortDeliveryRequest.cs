namespace BSS_API.Models.RequestModels
{
    public class EditSendUnsortDeliveryRequest
    {
        public long SendUnsortId { get; set; }

        public int DepartmentId { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}