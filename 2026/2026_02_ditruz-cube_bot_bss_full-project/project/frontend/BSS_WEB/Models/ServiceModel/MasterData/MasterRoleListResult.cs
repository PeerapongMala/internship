using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterRoleListResult : BaseApiResponse
    {
        public List<MasterRoleDisplay>? data { get; set; } = new List<MasterRoleDisplay>();
    }
}
