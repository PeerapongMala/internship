using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterMenuActiveListResult : BaseApiResponse
    {
        public List<MasterMenuActiveData>? data { get; set; } = new List<MasterMenuActiveData>();
    }
}
