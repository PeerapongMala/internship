using BSS_API.Models.Entities;

namespace BSS_API.Models.ObjectModels
{
    public class UserSessionLoginData
    {
        public bool hasLoginActive { get; set; } = false;
        public UserInfoData? userInfo { get; set; }
        public List<UserLoginLogData>? transactionUserLoginLogs { get; set; }
    }
}
