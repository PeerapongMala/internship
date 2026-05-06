using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterBanknoteTypeListResult : BaseApiResponse
    {
        public List<MasterBanknoteTypeDisplay>? data { get; set; } = new List<MasterBanknoteTypeDisplay>();
    }
}
