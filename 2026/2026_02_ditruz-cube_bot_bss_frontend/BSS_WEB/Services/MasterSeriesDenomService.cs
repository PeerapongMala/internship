using BSS_API.Models.RequestModels;
using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using Newtonsoft.Json;

namespace BSS_WEB.Services
{
    public class MasterSeriesDenomService : BaseApiClient, IMasterSeriesDenomService
    {
        public MasterSeriesDenomService(IHttpContextAccessor contextAccessor, ILogger<MasterSeriesDenomService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        } 

        public async Task<MasterSeriesDenomListResult> GetAllMasterSeriesDenomAsync()
        {
            return await SendAsync<MasterSeriesDenomListResult>(HttpMethod.Get, $"api/MasterSeriesDenom/GetAll");
        }

        public async Task<MasterSeriesDenomResult> GetSeriesDenomByIdAsync(int Id)
        {
            return await SendAsync<MasterSeriesDenomResult>(HttpMethod.Get, $"api/MasterSeriesDenom/GetById?Id={Id}");
        }

        public async Task<BaseServiceResult> UpdateSeriesDenomAsync(UpdateSeriesDenomRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterSeriesDenom/Update", request);
        }

        public async Task<BaseServiceResult> CreateSeriesDenomAsync(CreateSeriesDenomRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterSeriesDenom/Create", request);
        }

        public async Task<MasterSeriesDenomSearchResult> SearchSeriesDenomAsync(PagedRequest<MasterSeriesDenomRequest> request)
        {
            return await SendAsync<MasterSeriesDenomSearchResult>(HttpMethod.Post, $"api/MasterSeriesDenom/SearchSeriesDenom", request);
        }

        

         
    }
}
