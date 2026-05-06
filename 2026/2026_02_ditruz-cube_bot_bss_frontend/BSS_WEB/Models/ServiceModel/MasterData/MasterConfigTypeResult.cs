using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterConfigTypeResult : BaseApiResponse
    {
        public MasterConfigTypeDisplay? data { get; set; } = new MasterConfigTypeDisplay();

    }
}
