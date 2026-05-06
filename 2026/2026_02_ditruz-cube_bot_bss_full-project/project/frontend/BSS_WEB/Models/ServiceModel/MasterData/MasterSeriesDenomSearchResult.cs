using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterSeriesDenomSearchResult : BaseApiResponse
    {
        public PagedData<MasterSeriesDenomDisplay>? data { get; set; } = new ();

    }
}
