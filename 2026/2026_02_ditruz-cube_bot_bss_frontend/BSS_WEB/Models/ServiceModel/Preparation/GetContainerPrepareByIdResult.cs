namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class GetContainerPrepareByIdResult: BaseApiResponse
    {
        public TransactionContainerPrepareViewData? data {  get; set; } = new TransactionContainerPrepareViewData();
    }
}
