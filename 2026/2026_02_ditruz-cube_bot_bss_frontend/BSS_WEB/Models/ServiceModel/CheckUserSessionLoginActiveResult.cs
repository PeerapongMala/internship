using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class CheckUserSessionLoginActiveResult : BaseApiResponse
    {
        public UserSessionLoginData? data { get; set; } = new UserSessionLoginData();
    }
}
