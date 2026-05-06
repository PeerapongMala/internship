using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterConfigListResult : BaseApiResponse
    {
        public List<MasterConfigDisplay>? data { get; set; } = new List<MasterConfigDisplay>();
    }
}
