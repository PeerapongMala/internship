using BSS_API.Models.ObjectModels;

namespace BSS_API.Models.ServiceModels
{
    public class ErrorServiceResponse
    {
        public ErrorData error { get; set; } = new ErrorData();
    }
}
