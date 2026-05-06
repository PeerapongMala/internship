using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetUserInformationDataResult : BaseApiResponse
    {
        public UserAuthorizationData? data { get; set; } = new UserAuthorizationData();
    }
}
