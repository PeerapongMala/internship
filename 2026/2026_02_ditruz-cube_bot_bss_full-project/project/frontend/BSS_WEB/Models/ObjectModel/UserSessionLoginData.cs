namespace BSS_WEB.Models.ObjectModel
{
    public class UserSessionLoginData
    {
        public bool hasLoginActive { get; set; }
        public UserInfoData? userInfo { get; set; }
        public List<UserLoginLogData>? transactionUserLoginLogs { get; set; }
    }
}
