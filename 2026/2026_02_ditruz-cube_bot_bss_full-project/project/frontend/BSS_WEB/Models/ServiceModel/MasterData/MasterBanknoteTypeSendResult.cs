using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterBanknoteTypeSendResult : BaseApiResponse
    {
        public MasterBanknoteTypeSendDisplay? data { get; set; } = new MasterBanknoteTypeSendDisplay();
    }
}
