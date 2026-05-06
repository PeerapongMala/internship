namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class GetPreparationByIdResult : BaseApiResponse
    {
        public TransactionPreparationViewData? data { get; set; } = new TransactionPreparationViewData();

    }
}
