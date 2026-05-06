using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterCashTypeResult : BaseApiResponse
    {
        public MasterCashTypeDisplay? data { get; set; } = new MasterCashTypeDisplay();
    }
}
