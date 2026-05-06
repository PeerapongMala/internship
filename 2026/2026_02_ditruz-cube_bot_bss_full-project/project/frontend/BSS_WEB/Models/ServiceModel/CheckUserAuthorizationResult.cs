using BSS_WEB.Models.ObjectModel;
using Newtonsoft.Json;

namespace BSS_WEB.Models.ServiceModel
{
    public class CheckUserAuthorizationResult : BaseApiResponse
    {
        public UserAuthorizationData? data { get; set; } = new UserAuthorizationData();
    }
}
