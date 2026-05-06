using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterRoleGroupResult : BaseApiResponse
    {
        public MasterRoleGroupDisplay? data { get; set; } = new MasterRoleGroupDisplay();
    }
}
