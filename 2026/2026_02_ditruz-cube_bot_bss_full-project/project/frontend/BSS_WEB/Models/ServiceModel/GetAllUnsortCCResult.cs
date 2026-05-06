using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetAllUnsortCCResult : BaseApiResponse
    {
        public List<UnsortCCDisplay>? data { get; set; } = new List<UnsortCCDisplay>();

    }
}
