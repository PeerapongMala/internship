namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class GetAllContainerPrepareResult : BaseApiResponse
    {
        public List<TransactionContainerPrepareViewData>? data { get; set; } = new List<TransactionContainerPrepareViewData>();
    }
}
