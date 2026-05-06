using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetUserRoleByIdResult : BaseApiResponse
    {
        public MasterUserRoleDisplay? data { get; set; } = new MasterUserRoleDisplay();
    }
}
