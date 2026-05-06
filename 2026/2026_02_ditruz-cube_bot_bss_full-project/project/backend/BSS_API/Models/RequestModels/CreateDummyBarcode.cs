namespace BSS_API.Models.RequestModels
{
    public class CreateDummyBarcode
    {
        public long? receiveId { get; set; }

        public string barCode { get; set; }

        public int unfitQty { get; set; }
    }
}