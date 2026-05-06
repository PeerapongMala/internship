using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;

namespace BSS_API.Services.Interface
{
    public interface IMasterCompanyService
    {
        Task<IEnumerable<MasterCompany>> GetAllCompany();
        Task<IEnumerable<MasterCompany>> GetCompanyByUniqueOrKey(string companyCode);
        Task CreateCompany(CreateCompanyRequest request);
        Task UpdateCompany(UpdateCompanyRequest request);
        Task<MasterCompanyViewData> GetCompanyById(int Id);
        Task DeleteCompany(int Id);        
        Task<PagedData<MasterCompany>> SearchCompany(PagedRequest<MasterCompanyRequest> request);
        Task<IEnumerable<MasterCompany>> GetByIsActive();
    }
}


