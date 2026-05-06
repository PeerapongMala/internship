using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface INotificationService
    {
        Task<BaseApiResponse<SendMailOtpData>> SendOtpAsync(SendOtpRequest request);
        Task<BaseApiResponse<SendMailOtpData>> VerifyOtpAsync(VerifyOtpRequest request);
    }
}
