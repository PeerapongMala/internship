using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel.MasterData
{
    public class MasterBanknoteTypeResult : BaseApiResponse
    {
        public MasterBanknoteTypeDisplay? data { get; set; } = new MasterBanknoteTypeDisplay();
    }
}
