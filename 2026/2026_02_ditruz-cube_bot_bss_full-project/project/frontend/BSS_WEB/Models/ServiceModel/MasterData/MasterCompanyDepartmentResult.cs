using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterCompanyDepartmentResult : BaseApiResponse
    {
        public MasterCompanyDepartmentDisplay? data { get; set; } 
    }
}
