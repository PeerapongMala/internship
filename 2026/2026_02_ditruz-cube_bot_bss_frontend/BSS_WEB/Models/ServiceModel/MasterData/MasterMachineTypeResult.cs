using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterMachineTypeResult : BaseApiResponse 
    {
        public MasterMachineTypeDisplay? data { get; set; } = new MasterMachineTypeDisplay();
    }
}
