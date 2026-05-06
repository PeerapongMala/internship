using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterRoleGroupListResult : BaseApiResponse
    {
        public List<MasterRoleGroupDisplay>? data { get; set; } = new List<MasterRoleGroupDisplay>();
    }
}
