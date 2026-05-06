using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetUnsortCCByIdResult : BaseApiResponse
    {
        public UnsortCCDisplay? data { get; set; } = new UnsortCCDisplay();

    }
}
