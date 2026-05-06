
using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GenerateTokenResult : BaseApiResponse
    {
        public AuthenticationApp? data { get; set; } = new AuthenticationApp();
    }
}
