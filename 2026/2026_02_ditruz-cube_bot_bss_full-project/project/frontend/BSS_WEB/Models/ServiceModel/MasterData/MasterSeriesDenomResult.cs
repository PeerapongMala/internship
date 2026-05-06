using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterSeriesDenomResult : BaseApiResponse
    {
        public MasterSeriesDenomDisplay? data { get; set; } = new MasterSeriesDenomDisplay();

    }
}
