namespace BSS_API.Repositories.Interface
{
    using BSS_API.Models.Common;
    using BSS_API.Models.ObjectModels;
    using BSS_API.Models.RequestModels;
    using Models.Entities;
    using Models.SearchParameter;
    
    public interface IMasterUserRepository : IGenericRepository<MasterUser>
    {
        IQueryable<MasterUser> GetQueryable();

        Task<ICollection<MasterUser>> GetUserLoginDropdownAsync();
        Task<MasterUser?> GetFirstSupervisorFromDepartmentAsync(int departmentId);
        
        Task<ICollection<MasterUser>> GetMasterUserWithSearchRequestAsync(SystemSearchRequest request);

        Task<PagedData<MasterUserViewData>> SearchMasterUser(
          PagedRequest<MasterUserRequest> request,
          CancellationToken ct = default);
    }
}
