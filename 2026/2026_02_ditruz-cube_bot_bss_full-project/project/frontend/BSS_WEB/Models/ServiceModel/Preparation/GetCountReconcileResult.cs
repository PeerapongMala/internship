namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class GetCountReconcileResult : BaseApiResponse
    {
        public CountReconcileResponseModel? data { get; set; } = new CountReconcileResponseModel();
    }
}
