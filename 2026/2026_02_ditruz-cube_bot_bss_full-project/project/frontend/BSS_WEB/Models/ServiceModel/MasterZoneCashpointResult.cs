using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterZoneCashpointResult : BaseApiResponse
    {
        public MasterZoneCashpointDisplay? data { get; set; } = new MasterZoneCashpointDisplay(); 
    }
}
