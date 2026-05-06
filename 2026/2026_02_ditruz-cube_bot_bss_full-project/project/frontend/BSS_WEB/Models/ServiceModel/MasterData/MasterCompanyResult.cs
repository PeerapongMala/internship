using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterCompanyResult : BaseApiResponse
    {
        public MasterCompanyDisplay? data { get; set; } = new MasterCompanyDisplay();
    }
}
