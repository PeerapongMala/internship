using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterM7DenominationResult : BaseApiResponse
    {
        public MasterM7DenominationDisplay? data { get; set; } = new MasterM7DenominationDisplay();

    }
}
