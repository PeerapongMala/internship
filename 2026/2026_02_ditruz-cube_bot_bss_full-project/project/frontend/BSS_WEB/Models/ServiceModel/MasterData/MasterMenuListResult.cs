using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterMenuListResult : BaseApiResponse
    {
        public List<MasterMenuDisplay>? data { get; set; } = new List<MasterMenuDisplay>();

    }
}
