using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetAllMasterUserResult : BaseApiResponse
    {
        public List<MasterUserDisplay>? data { get; set; } = new List<MasterUserDisplay>();
    }
}
