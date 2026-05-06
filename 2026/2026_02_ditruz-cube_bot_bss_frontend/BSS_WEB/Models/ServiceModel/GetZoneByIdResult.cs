using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetZoneByIdResult : BaseApiResponse
    {
        public MasterZoneDisplay? data { get; set; } = new MasterZoneDisplay();
    }
}
