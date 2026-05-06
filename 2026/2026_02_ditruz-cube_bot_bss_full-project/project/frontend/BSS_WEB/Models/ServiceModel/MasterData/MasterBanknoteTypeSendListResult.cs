using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterBanknoteTypeSendListResult : BaseApiResponse
    {
        public List<MasterBanknoteTypeSendDisplay>? data { get; set; } = new List<MasterBanknoteTypeSendDisplay>();
    }
}
