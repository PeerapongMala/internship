using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterCashPointResult : BaseApiResponse
    {
        public MasterCashPointDisplay? data { get; set; } = new MasterCashPointDisplay();
    }
}
