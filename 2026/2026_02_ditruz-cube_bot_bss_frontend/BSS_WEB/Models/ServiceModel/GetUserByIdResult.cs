using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetUserByIdResult :BaseApiResponse
    {
        public MasterUserDisplay? data { get; set; } = new MasterUserDisplay();
    }
}
