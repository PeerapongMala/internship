using BSS_API.Models.ObjectModels;

namespace BSS_API.Models.ResponseModels
{
    public class BaseCbmsResponse<TData>
    {
        public BaseCbmsResponseModel<TData> jsonres {  get; set; }
    }
}
