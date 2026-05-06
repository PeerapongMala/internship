using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetAllMasterRolePermissionResult : BaseApiResponse
    {
        public List<MasterRolePermissionData>? data { get; set; } = new List<MasterRolePermissionData>();

    }
}
