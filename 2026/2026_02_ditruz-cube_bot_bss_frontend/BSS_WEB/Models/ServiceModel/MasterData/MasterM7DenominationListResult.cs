using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterM7DenominationListResult : BaseApiResponse
    {
        public List<MasterM7DenominationDisplay>? data { get; set; } = new List<MasterM7DenominationDisplay>();

    }
}
