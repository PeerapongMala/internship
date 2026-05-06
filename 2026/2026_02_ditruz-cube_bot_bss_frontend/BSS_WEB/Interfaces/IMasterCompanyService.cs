using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterCompanyService
    {
        Task<MasterCompanyListResult> GetAllMasterCompanyAsyn();
        Task<MasterCompanyResult> GetCompanyByIdAsync(int Id);
        Task<BaseServiceResult> UpdateCompanyAsync(UpdateCompanyRequest request);
        Task<BaseServiceResult> DeleteCompanyAsync(int Id);
        Task<BaseServiceResult> CreateCompanyAsync(CreateCompanyRequest request);
        Task<MasterCompanyPageResult> SearchMasterCompanyAsync(PagedRequest<MasterCompanyRequest> request);
        Task<MasterCompanyListResult> GetCompaniesIsActiveAsync();
    }
}
