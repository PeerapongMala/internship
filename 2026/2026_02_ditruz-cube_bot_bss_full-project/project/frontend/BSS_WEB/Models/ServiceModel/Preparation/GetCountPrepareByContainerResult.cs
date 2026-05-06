namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class GetCountPrepareByContainerResult : BaseApiResponse
    {
        public CountPrepareDataModel? data { get; set; } = new CountPrepareDataModel();
    }
}
