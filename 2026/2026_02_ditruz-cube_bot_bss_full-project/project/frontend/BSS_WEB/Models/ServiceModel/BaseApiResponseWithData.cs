namespace BSS_WEB.Models.ServiceModel
{
    public class BaseApiResponseWithData<T> : BaseApiResponse
    {
        public T? Data { get; set; }
    }
}
