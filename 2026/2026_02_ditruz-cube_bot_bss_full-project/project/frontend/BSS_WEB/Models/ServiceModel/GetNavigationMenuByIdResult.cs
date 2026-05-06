using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetNavigationMenuByIdResult : BaseApiResponse
    {
        public List<NavigationMenuDisplay>? data { get; set; } = new List<NavigationMenuDisplay>();
    }
}
