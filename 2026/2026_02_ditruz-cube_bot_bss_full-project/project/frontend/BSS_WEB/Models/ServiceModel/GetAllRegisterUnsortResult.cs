using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetAllRegisterUnsortResult : BaseApiResponse
    {
        public List<RegisterUnsortDisplay>? data { get; set; } = new List<RegisterUnsortDisplay>();

    }

}
