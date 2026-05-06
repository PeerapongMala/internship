using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterDepartmentListResult : BaseApiResponse
    {
        public List<MasterDepartmentDisplay>? data { get; set; } = new List<MasterDepartmentDisplay>();
    }
}
