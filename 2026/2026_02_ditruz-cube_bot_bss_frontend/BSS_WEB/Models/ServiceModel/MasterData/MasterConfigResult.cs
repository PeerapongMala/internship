using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterConfigResult :BaseApiResponse
    {
        public MasterConfigDisplay? data { get; set; } = new MasterConfigDisplay();
    }
}
