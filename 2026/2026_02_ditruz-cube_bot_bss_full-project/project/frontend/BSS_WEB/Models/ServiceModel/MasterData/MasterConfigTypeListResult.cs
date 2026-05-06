using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterConfigTypeListResult : BaseApiResponse
    {
        public List<MasterConfigTypeDisplay>? data { get; set; } = new List<MasterConfigTypeDisplay>();
    }
}
