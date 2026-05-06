using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class MasterCompanyInstitutionResult : BaseApiResponse
    {
        public MasterCompanyInstitutionDisplay? data { get; set; } 
    }
}
