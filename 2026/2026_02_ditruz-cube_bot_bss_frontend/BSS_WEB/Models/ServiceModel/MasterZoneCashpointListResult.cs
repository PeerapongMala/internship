using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterZoneCashpointListResult : BaseApiResponse 
    {
        public List<MasterZoneCashpointDisplay>? data { get; set; } = new List<MasterZoneCashpointDisplay>();
    }
}
