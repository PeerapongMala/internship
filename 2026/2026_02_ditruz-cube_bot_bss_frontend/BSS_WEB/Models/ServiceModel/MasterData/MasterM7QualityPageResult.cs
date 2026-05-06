using BSS_API.Models.SearchParameter;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel; 

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterM7QualityPageResult : BaseApiResponse
    {
        public PagedData<MasterM7QualityDisplay>? data { get; set; }

    }
}
