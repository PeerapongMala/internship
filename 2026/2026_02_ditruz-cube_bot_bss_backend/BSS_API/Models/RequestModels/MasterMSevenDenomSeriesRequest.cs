namespace BSS_API.Models.RequestModels
{
    public class MasterMSevendenomSeriesRequest
    {         
        public int? MSevendenomSeriesId { get; set; }
        public int? MSevenDenomId { get; set; }
        public int? SeriesDenomId { get; set; }
         
        public bool? IsActive { get; set; } 
    }
}
