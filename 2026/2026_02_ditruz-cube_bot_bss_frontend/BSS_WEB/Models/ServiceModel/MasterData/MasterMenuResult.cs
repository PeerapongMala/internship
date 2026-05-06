using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterMenuResult : BaseApiResponse
    {
        public MasterMenuDisplay? data { get; set; } = new MasterMenuDisplay();

    }
}
