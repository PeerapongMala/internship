using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterInstitutionResult : BaseApiResponse
    {
        public MasterInstitutionDisplay? data { get; set; } = new MasterInstitutionDisplay();
    }
}
