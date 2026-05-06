using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterDenomReconcileListResult : BaseApiResponse
    {
        public List<MasterDenomReconcileDisplay>? data { get; set; } = new List<MasterDenomReconcileDisplay>();

    }
}
