using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;
using Newtonsoft.Json;

namespace BSS_WEB.Services
{
    public class RegisterUnsortService : BaseApiClient , IRegisterUnsortService
    {
        public RegisterUnsortService(IHttpContextAccessor contextAccessor, HttpClient client, ILogger<RegisterUnsortService> logger) 
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<GetAllRegisterUnsortResult> GetRegisterUnsortAllAsync()
        {
            return await SendAsync<GetAllRegisterUnsortResult>(HttpMethod.Get, $"api/RegisterUnsort/GetAllRegisterUnsort/Join");
        }

        public async Task<GetRegisterUnsortByIdResult> GetRegisterUnsortByIdAsync(long Id)
        {
            return await SendAsync<GetRegisterUnsortByIdResult>(HttpMethod.Get, $"api/RegisterUnsort/GetRegisterUnsortById?Id={Id}");
        }

        public async Task<BaseServiceResult> UpdateRegisterUnsortAsync(RegisterUnsortDisplay request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/RegisterUnsort/UpdateRegisterUnsort", request);
        }

        public async Task<BaseApiResponse<ConfirmRegisterUnsortRequest>> EditRegisterUnsortContainerAsync(ConfirmRegisterUnsortRequest confirmRegisterUnsortRequest)
        {
            return await SendAsync<BaseApiResponse<ConfirmRegisterUnsortRequest>>(HttpMethod.Post, $"api/TransactionRegisterUnsort/EditRegisterUnsortContainer", confirmRegisterUnsortRequest);
        }

        public async Task<BaseApiResponse<ConfirmUnsortCCRequest>> EditUnsortCCStatusDeliveryAsync(ConfirmUnsortCCRequest confirmUnsortCCRequest)
        {
            return await SendAsync<BaseApiResponse<ConfirmUnsortCCRequest>>(HttpMethod.Post, $"api/TransactionRegisterUnsort/EditUnsortCCStatusDelivery", confirmUnsortCCRequest);
        }

        public async Task<BaseApiResponse<ConfirmRegisterUnsortRequest>> ConfirmRegisterUnsortAsync(ConfirmRegisterUnsortRequest request)
        {
            return await SendAsync<BaseApiResponse<ConfirmRegisterUnsortRequest>>(HttpMethod.Post, $"api/TransactionRegisterUnsort/ConfirmRegisterUnsort", request);
        }
        public async Task<BaseServiceResult> DeleteRegisterUnsortAsync(long Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/RegisterUnsort/RemoveRegisterUnsort?Id={Id}");
        }

        public async Task<GetAllUnsortCCResult> GetUnsortCCAllAsync(long? registerUnsortId = null)
        {
            if (registerUnsortId.HasValue)
            {
                return await SendAsync<GetAllUnsortCCResult>(HttpMethod.Get,$"api/RegisterUnsort/GetAllUnsortCC/Join?registerUnsortId={registerUnsortId.Value}");
            }

            return await SendAsync<GetAllUnsortCCResult>(HttpMethod.Get, $"api/RegisterUnsort/GetAllUnsortCC/Join");
        }

        public async Task<GetUnsortCCByIdResult> GetUnsortCCByIdAsync(long Id)
        {
            return await SendAsync<GetUnsortCCByIdResult>(HttpMethod.Get, $"api/RegisterUnsort/GetUnsortCCById?Id={Id}");
        }

        public async Task<GetAllUnsortCCResult> GetUnsortCCByFilterAsync(UnsortCCDropdown request)
        {
            return await SendAsync<GetAllUnsortCCResult>(HttpMethod.Post, $"api/RegisterUnsort/GetUnsortCCByDropdown", request);
        }

        public async Task<BaseServiceResult> CreateUnsortCCAsync(UnsortCCDisplay request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/RegisterUnsort/CreateUnsortCC", request);
        }

        public async Task<BaseServiceResult> UpdateUnsortCCAsync(UnsortCCDisplay request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/RegisterUnsort/UpdateUnsortCC", request);
        }

        public async Task<BaseServiceResult> DeleteUnsortCCAsync(long Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/RegisterUnsort/RemoveUnsortCC?Id={Id}");
        }

        public async Task<BaseApiResponse<List<RegisterUnsortDataResponse>>?> LoadRegisterUnsortList(int DepartmentId)
        {
            return await SendAsync<BaseApiResponse<List<RegisterUnsortDataResponse>>>(
                HttpMethod.Get,
                $"api/TransactionRegisterUnsort/LoadRegisterUnsortList?departmentId={DepartmentId}"
            );
        }
    }
}

