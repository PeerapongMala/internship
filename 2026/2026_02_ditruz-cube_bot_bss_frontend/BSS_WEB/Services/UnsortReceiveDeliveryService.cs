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
    public class UnsortReceiveDeliveryService : BaseApiClient , IUnsortReceiveDeliveryService
    {
        public UnsortReceiveDeliveryService(IHttpContextAccessor contextAccessor, HttpClient client, ILogger<UnsortReceiveDeliveryService> logger) 
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<BaseApiResponse<List<SendrUnsortCCDataResponse>>?> LoadSendUnsortCCList(int DepartmentId, int UserId)
        {
            return await SendAsync<BaseApiResponse<List<SendrUnsortCCDataResponse>>>(
                HttpMethod.Get,
                $"api/UnsortReceiveDelivery/LoadSendUnsortCCList?departmentId={DepartmentId}&UserId={UserId}"
            );
        }

        public async Task<BaseApiResponse<SendrUnsortCCDataResponse>?> GetUnsortReceiveDeliverly(int DepartmentId,string SendUnsortCode)
        {
            return await SendAsync<BaseApiResponse<SendrUnsortCCDataResponse>>(
                HttpMethod.Get,
                $"api/UnsortReceiveDelivery/GetReceiveBySendUnsortCode?departmentId={DepartmentId}&SendUnsortCode={SendUnsortCode}"
            );
        }

        public async Task<BaseApiResponse<int>?> RemoveBinContainerNotPrepareData(int SendUnsortId, int UserId)
        {
            // เปลี่ยนจาก <int> เป็น <BaseApiResponse<int>>
            return await SendAsync<BaseApiResponse<int>>(
                HttpMethod.Delete,
                $"api/UnsortReceiveDelivery/RemoveBinContainerNotPrepareData?Id={SendUnsortId}&UserId={UserId}"
            );
        }

        // --- เพิ่มเติมสำหรับกระบวนการยืนยันรับมอบ ---
        public async Task<BaseApiResponse<bool>?> ExecuteReceiveDelivery(int sendUnsortId, int userId)
        {
            // สร้าง Request Object ให้ตรงกับ API Model หลังบ้าน
            var requestBody = new
            {
                SendUnsortId = sendUnsortId,
                UserId = userId
            };

            return await SendAsync<BaseApiResponse<bool>>(
                HttpMethod.Post,
                "api/UnsortReceiveDelivery/ExecuteReceive",
                requestBody // BaseApiClient จะ Serialize เป็น JSON ให้โดยอัตโนมัติ
            );
        }

        // --- เพิ่มเติมสำหรับกระบวนการปฏิเสธการรับมอบ ---
        public async Task<BaseApiResponse<bool>?> ExecuteRejectDelivery(int sendUnsortId, int userId, string note)
        {
            var requestBody = new
            {
                SendUnsortId = sendUnsortId,
                UserId = userId,
                Note = note
            };

            return await SendAsync<BaseApiResponse<bool>>(
                HttpMethod.Post,
                "api/UnsortReceiveDelivery/ExecuteReject",
                requestBody
            );
        }

        public async Task<BaseApiResponse<bool>?> ExecuteReturnDelivery(List<int> ids, int userId, string note)
        {
            // สร้าง Request Object โดยส่ง ids (List<int>) แทน ID เดียว
            var requestBody = new
            {
                SendUnsortIds = ids, // เปลี่ยนจาก SendUnsortId เป็นรายการ IDs
                UserId = userId,
                Note = note
            };

            return await SendAsync<BaseApiResponse<bool>>(
                HttpMethod.Post,
                "api/UnsortReceiveDelivery/ExecuteReturn",
                requestBody
            );
        }

        public async Task<BaseApiResponse<UnsortCCReceiveResponse>?> UpdateRemainingQtyReceive(UpdateRemainingQtyReceiveRequest request)
        {
            
            return await SendAsync<BaseApiResponse<UnsortCCReceiveResponse>>(
                HttpMethod.Post,
                "api/UnsortReceiveDelivery/UpdateRemainingQtyReceive",
                request
            );
        }

    }
}

