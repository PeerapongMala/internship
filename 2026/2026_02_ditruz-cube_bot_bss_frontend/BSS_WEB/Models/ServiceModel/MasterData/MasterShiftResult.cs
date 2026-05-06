using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterShiftResult : BaseApiResponse
    {
        public MasterShiftDisplay? data { get; set; } = new MasterShiftDisplay();

    }
}
