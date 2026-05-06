using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterCashCenterListResult : BaseApiResponse
    {
        public List<MasterCashCenterDisplay>? data { get; set; } = new List<MasterCashCenterDisplay>();
    }
}
