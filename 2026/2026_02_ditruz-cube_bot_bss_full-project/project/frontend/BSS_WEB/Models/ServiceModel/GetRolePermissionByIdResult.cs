using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetRolePermissionByIdResult : BaseApiResponse
    {
        public List<MasterRolePermissionDetailData>? data { get; set; } = new List<MasterRolePermissionDetailData>();

    }
}
