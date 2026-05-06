using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterStatusListResult : BaseApiResponse
    {
        public List<MasterStatusDisplay>? data { get; set; } = new List<MasterStatusDisplay>();
    }
}
