using BSS_WEB.Models.ObjectModel;

namespace BSS_WEB.Models.ServiceModel
{
    public class UpdateUserOperationSettingResult : BaseApiResponse
    {
        public UpdateUserOperationSettingDasta? data { get; set; } = new UpdateUserOperationSettingDasta();
    }
}
