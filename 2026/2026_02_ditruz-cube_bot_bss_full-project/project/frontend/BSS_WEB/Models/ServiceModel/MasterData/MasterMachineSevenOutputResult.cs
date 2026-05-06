using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterMachineSevenOutputResult : BaseApiResponse
    {
        public MasterMachineSevenOutputDisplay? data { get; set; } = new MasterMachineSevenOutputDisplay();

    }
}
