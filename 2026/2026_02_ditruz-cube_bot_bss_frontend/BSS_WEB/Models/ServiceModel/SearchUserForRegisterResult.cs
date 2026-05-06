using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class SearchUserForRegisterResult : BaseApiResponse
    {
        public List<SearchUserForRegisterData>? data { get; set; } = new List<SearchUserForRegisterData>();
    }
}
