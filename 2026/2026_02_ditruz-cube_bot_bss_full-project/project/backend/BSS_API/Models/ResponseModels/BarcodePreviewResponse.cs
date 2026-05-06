namespace BSS_API.Models.ResponseModels
{
    public class BarcodePreviewResponse
    {
        public string? PackageCode { get; set; }
        public string? BundleCode { get; set; }
        public int WrapSequence { get; set; }
        public int BundleSequence { get; set; }
    }
}
