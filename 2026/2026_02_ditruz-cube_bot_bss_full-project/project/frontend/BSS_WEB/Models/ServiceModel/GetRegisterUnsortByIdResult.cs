using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetRegisterUnsortByIdResult : BaseApiResponse
    {
        public RegisterUnsortDisplay? data { get; set; } = new RegisterUnsortDisplay();

    }
}
