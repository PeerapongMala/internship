using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterInstitutionListResult : BaseApiResponse
    {
        public List<MasterInstitutionDisplay>? data { get; set; } = new List<MasterInstitutionDisplay>();
    }
}
