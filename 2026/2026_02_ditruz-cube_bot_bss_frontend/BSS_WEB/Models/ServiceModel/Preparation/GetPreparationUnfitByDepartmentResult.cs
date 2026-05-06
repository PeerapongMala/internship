namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class GetPreparationUnfitByDepartmentResult : BaseApiResponse
    {
        public PreparationUnfitViewData? data { get; set; } = new PreparationUnfitViewData();
    }
}
