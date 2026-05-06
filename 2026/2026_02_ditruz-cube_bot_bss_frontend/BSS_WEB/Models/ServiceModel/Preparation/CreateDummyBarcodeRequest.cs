namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class CreateDummyBarcodeRequest
    {
        public long receiveId { get; set; }
        public string barCode { get; set; } = string.Empty;
        public int unfitQty { get; set; }
    }
}
