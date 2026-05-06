using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterM7DenomSeriesResult : BaseApiResponse
    {
        public MasterM7DenomSeriesDisplay? data { get; set; } = new MasterM7DenomSeriesDisplay();

    }
}
