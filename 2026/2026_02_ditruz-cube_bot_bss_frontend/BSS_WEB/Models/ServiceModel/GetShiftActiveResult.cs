using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetShiftActiveResult : BaseApiResponse
    {
        public ShiftInfoData? data { get; set; } = new ShiftInfoData();
    }
}
