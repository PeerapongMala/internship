namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class GetAllPreparationResult : BaseApiResponse
    {
        public List<TransactionPreparationViewData>? data { get; set; } = new List<TransactionPreparationViewData>();

    }
}
