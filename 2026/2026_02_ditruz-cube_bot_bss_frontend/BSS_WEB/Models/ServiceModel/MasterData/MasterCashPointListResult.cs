using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterCashPointListResult : BaseApiResponse
    {
        public List<MasterCashPointDisplay>? data { get; set; } = new List<MasterCashPointDisplay>();
    }
}
