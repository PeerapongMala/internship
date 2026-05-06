using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetUserLoginDropdownResult: BaseApiResponse
    {
        public List<UserLoginDropdownData>? data { get; set; }
    }
}
