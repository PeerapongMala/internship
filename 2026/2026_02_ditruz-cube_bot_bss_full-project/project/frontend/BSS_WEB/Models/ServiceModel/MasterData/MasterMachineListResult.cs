using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterMachineListResult : BaseApiResponse
    {
        public List<MasterMachineDisplay>? data { get; set; } = new List<MasterMachineDisplay>();
    }
}
