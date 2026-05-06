using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class DefaultConfigInfoResult : BaseApiResponse
    {
        public DefaultConfigInfoData? data { get; set; } = new DefaultConfigInfoData();
    }
}
