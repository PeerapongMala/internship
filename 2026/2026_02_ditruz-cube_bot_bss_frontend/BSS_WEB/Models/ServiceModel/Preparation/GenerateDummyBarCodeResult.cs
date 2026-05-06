namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class GenerateDummyBarCodeResult : BaseApiResponse
    {
        public DummyBarcodeDataModel? data { get; set; } = new DummyBarcodeDataModel();
    }
}
