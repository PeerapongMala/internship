namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class PreparationUnfitViewData
    {
        public string packageCode { get; set; }
        public string bundleCode { get; set; }
        public string headerCardCode { get; set; }
        public string? institutionShortName { get; set; }
        public string? cashCenterName { get; set; }
        public decimal? denoPrice { get; set; }
        public DateTime prepareDate { get; set; }
        public string? containerCode { get; set; }
    }
}
