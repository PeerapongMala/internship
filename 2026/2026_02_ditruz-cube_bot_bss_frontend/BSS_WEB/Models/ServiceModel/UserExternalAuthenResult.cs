using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class UserExternalAuthenResult : BaseApiResponse
    {
        public UserExternalAuthenData? data { get; set; } = new UserExternalAuthenData();
    }
}
