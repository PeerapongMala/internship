using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterCompanyDepartmentListResult : BaseApiResponse
    {
        public List<MasterCompanyDepartmentDisplay>? data { get; set; } = new List<MasterCompanyDepartmentDisplay>();
    }
}
