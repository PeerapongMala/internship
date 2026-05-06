using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterCompanyListResult : BaseApiResponse
    {
        public List<MasterCompanyDisplay>? data { get; set; } = new List<MasterCompanyDisplay>();
    }
}
