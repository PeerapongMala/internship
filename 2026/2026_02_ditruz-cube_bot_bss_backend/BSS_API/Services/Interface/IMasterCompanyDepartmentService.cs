using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterCompanyDepartmentService
    {
        Task<IEnumerable<MasterCompanyDepartment>> GetAllCompanyDepartment();
        Task<MasterCompanyDepartmentViewData> GetCompanyDepartmentById(int Id);
        Task<MasterCompanyDepartmentViewData> GetCompanyDepartmentByDepartmentId(int departmentId);
        Task<IEnumerable<MasterCompanyDepartment>> GetCompanyDepartmentByUniqueOrKey(int companyId, int departmentId);
        Task CreateCompanyDepartment(CreateCompanyDepartment request);
        Task UpdateCompanyDepartment(UpdateCompanyDepartment request);
        Task DeleteCompanyDepartment(int id);
        Task<UserCompanyDepartmentInfoData> GetCompanyDepartmentInfo(int departmentId);
        Task<PagedData<MasterCompanyDepartmentViewData>> SearchCompanyDepartment (PagedRequest<MasterCompanyDepartmentRequest> request);
        Task<string> GetCbBcdCode(int companyId);
        Task<string> GetCbBcdCode(int departmentId,int institutionId);
    }
}
