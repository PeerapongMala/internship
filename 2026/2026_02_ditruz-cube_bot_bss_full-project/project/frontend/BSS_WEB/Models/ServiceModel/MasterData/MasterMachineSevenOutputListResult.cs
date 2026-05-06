using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterMachineSevenOutputListResult : BaseApiResponse
    {
        public List<MasterMachineSevenOutputDisplay>? data { get; set; } = new List<MasterMachineSevenOutputDisplay>();
    }
}
