namespace BSS_API.Models.RequestModels
{
    public class MasterSeriesDenomRequest
    {
        public int? SeriesDenomId { get; set; }
        public string SeriesCode { get; set; } = string.Empty;
        public bool? IsActive { get; set; }
    }
}
