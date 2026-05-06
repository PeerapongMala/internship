using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterDenominationResult : BaseApiResponse
    {
        public MasterDenominationDisplay? data { get; set; } = new MasterDenominationDisplay();
    }
}
