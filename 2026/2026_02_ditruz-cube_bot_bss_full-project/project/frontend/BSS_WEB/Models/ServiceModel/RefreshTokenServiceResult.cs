using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class RefreshTokenServiceResult : BaseApiResponse
    {
        public BssRefreshTokenResponseData? data { get; set; } = new BssRefreshTokenResponseData();
    }
}
