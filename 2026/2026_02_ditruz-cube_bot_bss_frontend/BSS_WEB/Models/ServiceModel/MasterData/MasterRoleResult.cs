using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterRoleResult : BaseApiResponse
    {
        public MasterRoleDisplay? data { get; set; } = new MasterRoleDisplay();
    }
}
