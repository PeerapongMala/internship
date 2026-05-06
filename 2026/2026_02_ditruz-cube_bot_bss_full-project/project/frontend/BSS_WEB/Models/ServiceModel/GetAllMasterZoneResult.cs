using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetAllMasterZoneResult : BaseApiResponse
    {
        public List<MasterZoneDisplay>? data { get; set; } = new List<MasterZoneDisplay> ();
    }
}
