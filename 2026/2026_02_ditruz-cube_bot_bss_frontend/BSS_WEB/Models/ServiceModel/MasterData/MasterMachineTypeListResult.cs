using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterMachineTypeListResult : BaseApiResponse
    {
        public List<MasterMachineTypeDisplay>? data { get; set; } = new List<MasterMachineTypeDisplay>();
    }
}
