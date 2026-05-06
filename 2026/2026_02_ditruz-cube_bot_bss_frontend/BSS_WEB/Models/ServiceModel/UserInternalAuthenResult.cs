using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class UserInternalAuthenResult : BaseApiResponse
    {
        public UserInternalAuthenData? data { get; set; } = new UserInternalAuthenData();
    }
}
