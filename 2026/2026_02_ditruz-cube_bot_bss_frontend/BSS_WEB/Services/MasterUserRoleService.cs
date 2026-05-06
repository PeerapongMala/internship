using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Services
{
    public class MasterUserRoleService : BaseApiClient , IMasterUserRoleService
    {
        public MasterUserRoleService(IHttpContextAccessor contextAccessor, ILogger<MasterUserRoleService> logger , HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<GetAllMasterUserRoleResult> GetAllMasterUserRoleAsyn()
        {
            return await SendAsync<GetAllMasterUserRoleResult>(HttpMethod.Get, $"api/MasterUserRole/GetAll");
        }

        public async Task<GetUserRoleByIdResult> GetUserRoleByIdAsync(int Id)
        {
            return await SendAsync<GetUserRoleByIdResult>(HttpMethod.Get, $"api/MasterUserRole/GetById?Id={Id}");
        }

        public async Task<GetUserRoleByIdResult> GetUserRoleByUserIdAsync(int userId)
        {
            return await SendAsync<GetUserRoleByIdResult>(HttpMethod.Get, $"api/MasterUserRole/GetByUserId?Id={userId}");
        }
    }
}
