using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterShiftListResult : BaseApiResponse
    { 
        public List<MasterShiftDisplay>? data { get; set; } = new List<MasterShiftDisplay>();

    }
}
