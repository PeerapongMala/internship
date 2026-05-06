namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class GetAllReceiveCbmsDataResult : BaseApiResponse
    {
        public List<TransactionReceiveCbmsViewData>? data { get; set; } = new List<TransactionReceiveCbmsViewData>();

    }
}
