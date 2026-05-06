using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterDepartmentService
    {
        Task<MasterDepartmentListResult> GetDepartmentsAllAsync();
        Task<MasterDepartmentResult> GetDepartmentsByIdAsync(int Id);
        Task<BaseServiceResult> CreateDepartmentAsync(CreateDepartmentRequest request);
        Task<BaseServiceResult> UpdateDepartmentAsync(UpdateDepartmentRequest request);
        Task<BaseServiceResult> DeleteDepartmentAsync(int Id);
        Task<MasterDepartmentListResult> GetDepartmentByFilterAsync(DepartmentFilterSearch request);
        Task<MasterDepartmentPageResult> SearchMasterDepartmentAsync(PagedRequest<MasterDepartmentRequest> request);
        Task<MasterDepartmentListResult> GetDepartmentsActiveAsync();
    }
}
