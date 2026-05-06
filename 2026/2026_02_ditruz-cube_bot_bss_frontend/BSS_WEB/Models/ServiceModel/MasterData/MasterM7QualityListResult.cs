using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterM7QualityListResult : BaseApiResponse
    {
        public List<MasterM7QualityDisplay>? data { get; set; } = new List<MasterM7QualityDisplay>();

    }
}
