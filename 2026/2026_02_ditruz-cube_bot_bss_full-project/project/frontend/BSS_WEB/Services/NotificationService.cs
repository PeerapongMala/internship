using BSS_WEB.Interfaces;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchParameter;
using BSS_WEB.Models.ServiceModel;
using static System.Net.WebRequestMethods;

namespace BSS_WEB.Services
{
    public class NotificationService : BaseApiClient, INotificationService
    {
        public NotificationService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<NotificationService> logger) 
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<BaseApiResponse<SendMailOtpData>> SendOtpAsync(SendOtpRequest request)
        {
            return await SendAsync<BaseApiResponse<SendMailOtpData>>(
               HttpMethod.Post,
               "api/BssMail/SendMail",
               request
           );
        }
       
        public async Task<BaseApiResponse<SendMailOtpData>> VerifyOtpAsync(VerifyOtpRequest request)
        {
            return await SendAsync<BaseApiResponse<SendMailOtpData>>(
               HttpMethod.Post,
               "api/BssMail/ValidateMail",
               request
           );
        }
    }
}
