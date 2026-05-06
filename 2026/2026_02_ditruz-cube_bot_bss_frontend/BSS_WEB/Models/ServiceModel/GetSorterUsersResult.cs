using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class GetSorterUsersResult : BaseApiResponse
    {
        public List<UserInfoData>? data { get; set; } = new List<UserInfoData>();
    }
}
