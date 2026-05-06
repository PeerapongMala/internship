using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterDenomReconcileResult : BaseApiResponse
    {
        public MasterDenomReconcileDisplay? data { get; set; } = new MasterDenomReconcileDisplay();

    }
}
