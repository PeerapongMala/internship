using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterDepartmentResult : BaseApiResponse
    {
        public MasterDepartmentDisplay? data { get; set; } = new MasterDepartmentDisplay();
    }
}
