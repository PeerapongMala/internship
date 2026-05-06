using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterDenominationListResult : BaseApiResponse
    {
        public List<MasterDenominationDisplay>? data { get; set; } = new List<MasterDenominationDisplay>();

    }
}
