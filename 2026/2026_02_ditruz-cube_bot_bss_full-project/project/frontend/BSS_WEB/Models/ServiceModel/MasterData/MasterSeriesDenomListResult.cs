using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterSeriesDenomListResult : BaseApiResponse
    { 
        public List<MasterSeriesDenomDisplay>? data { get; set; } = new List<MasterSeriesDenomDisplay>();

    }
}
