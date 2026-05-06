namespace BSS_WEB.Models.ObjectModel
{
    public class CreateSendUnsortCCRequest
    {
        public int CreatedBy { get; set; }

        public int DepartmentId { get; set; }

        public string DeliveryCode { get; set; }

        public ICollection<long> RegisterUnsortId { get; set; }
    }
}
