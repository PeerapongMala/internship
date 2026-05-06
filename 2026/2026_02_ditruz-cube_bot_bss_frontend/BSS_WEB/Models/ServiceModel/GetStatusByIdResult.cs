using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetStatusByIdResult : BaseApiResponse
    {
        public MasterStatusDisplay? data { get; set; } = new MasterStatusDisplay();
    }
}
