using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterCashTypeListResult : BaseApiResponse
    {
        public List<MasterCashTypeDisplay>? data { get; set; } = new List<MasterCashTypeDisplay>();
    }
}
