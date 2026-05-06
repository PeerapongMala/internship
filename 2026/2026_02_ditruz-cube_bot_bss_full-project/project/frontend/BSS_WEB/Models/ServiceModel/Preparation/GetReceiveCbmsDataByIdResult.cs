namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class GetReceiveCbmsDataByIdResult : BaseApiResponse
    {
        public TransactionReceiveCbmsViewData? data { get; set; } = new TransactionReceiveCbmsViewData();

    }
}
