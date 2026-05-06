using BSS_WEB.Models.DisplayModel; 
namespace BSS_WEB.Models.ServiceModel
{
    public class MasterM7QualityResult : BaseApiResponse
    {
        public MasterM7QualityDisplay? data { get; set; } = new MasterM7QualityDisplay();

    }
}
