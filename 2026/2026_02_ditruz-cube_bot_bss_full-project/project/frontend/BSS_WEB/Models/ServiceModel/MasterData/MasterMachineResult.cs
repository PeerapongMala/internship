using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterMachineResult : BaseApiResponse
    {
        public MasterMachineDisplay? data { get; set; } = new MasterMachineDisplay();
    }
}
