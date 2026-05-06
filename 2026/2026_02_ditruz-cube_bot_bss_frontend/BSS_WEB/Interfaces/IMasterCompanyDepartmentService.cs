using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterCompanyDepartmentService
    {
       
        Task<MasterCompanyDepartmentResult> GetCompanyDepartmentByIdAsync(int Id);
        Task<BaseServiceResult> UpdateCompanyDepartmentAsync(UpdateCompanyDepartmentRequest request); 
        Task<BaseServiceResult> CreateCompanyDepartmentAsync(CreateCompanyDepartmentRequest request);
        Task<MasterCompanyDepartmentPageResult> SearchMasterCompanyDepartmentAsync(PagedRequest<MasterCompanyDepartmentRequest> request);
        Task<BaseServiceResult> GetCbBcdCodeByDepartmentInstitution(int departmentId, int institution);
        Task<BaseServiceResult> GetCbBcdCodeByCompany(int companyId);
    }
}
