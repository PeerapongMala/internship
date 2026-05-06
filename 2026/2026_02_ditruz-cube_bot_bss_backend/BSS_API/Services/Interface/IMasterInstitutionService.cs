using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterInstitutionService
    {
        Task<IEnumerable<MasterInstitution>> GetAllInstitution();
        Task<MasterInstitutionViewData> GetInstitutionById(int Id);
        Task<IEnumerable<MasterInstitution>> GetInstitutionByUniqueOrKey(string institutionCode);
        Task CreateInstitution(CreateInstitutionRequest request);
        Task UpdateInstitution(UpdateInstitutionRequest request);
        Task DeleteInstitution(int Id);
        Task<PagedData<MasterInstitution>> SearchInstitution(PagedRequest<MasterInstitutionRequest> request);


    }
}
