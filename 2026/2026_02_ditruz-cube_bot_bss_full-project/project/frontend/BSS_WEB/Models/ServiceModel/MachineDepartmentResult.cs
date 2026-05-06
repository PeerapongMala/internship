using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MachineDepartmentResult :BaseApiResponse
    {
        public List<MasterMachineViewDisplay>? data { get; set; } = new List<MasterMachineViewDisplay>();
    }
}
