using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterCashCenterResult :BaseApiResponse
    {
        public MasterCashCenterDisplay? data { get; set; } = new MasterCashCenterDisplay();
    }
}
