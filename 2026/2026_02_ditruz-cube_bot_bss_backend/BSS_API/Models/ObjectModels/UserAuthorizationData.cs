namespace BSS_API.Models.ObjectModels
{
    public class UserAuthorizationData
    {
        public UserInfoData userInfo { get; set; } = new UserInfoData();
        public UserCompanyDepartmentInfoData userCompanyDepartmentInfo { get; set; } = new UserCompanyDepartmentInfoData();
        public RoleGroupInfoData roleGroupInfo { get; set; } = new RoleGroupInfoData();
        public List<RoleInfoData> roleData { get; set; } = new List<RoleInfoData>();
        public DefaultConfigInfoData configInfo { get; set; } = new DefaultConfigInfoData();
        public ShiftInfoData? shiftInfo { get; set; } = new ShiftInfoData();
    }
}
