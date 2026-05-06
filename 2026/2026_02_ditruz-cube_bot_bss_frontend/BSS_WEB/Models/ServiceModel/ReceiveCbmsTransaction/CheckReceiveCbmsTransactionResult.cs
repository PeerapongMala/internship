using BSS_WEB.Models.ServiceModel.Preparation;

namespace BSS_WEB.Models.ServiceModel.ReceiveCbmsTransaction
{
    public class CheckReceiveCbmsTransactionResult : BaseApiResponse
    {
        public List<TransactionReceiveCbmsViewData>? data { get; set; } = new List<TransactionReceiveCbmsViewData>();
    }
}
