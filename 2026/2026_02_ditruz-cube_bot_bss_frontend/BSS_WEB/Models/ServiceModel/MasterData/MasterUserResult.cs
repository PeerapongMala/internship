using BSS_API.Models.SearchParameter;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterUserResult : BaseApiResponse
    {
        public PagedData<MasterUserDisplay>? data { get; set; }

    }
}
