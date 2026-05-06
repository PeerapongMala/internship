using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetAllMasterUserRoleResult : BaseApiResponse
    {
        public List<MasterUserRoleDisplay>? data { get; set; } = new List<MasterUserRoleDisplay>();
    }
}
