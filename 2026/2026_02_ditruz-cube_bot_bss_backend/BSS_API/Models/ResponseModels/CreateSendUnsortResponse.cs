namespace BSS_API.Models.ResponseModels
{
    public class CreateSendUnsortResponse
    {
        public ICollection<string> ContaineCode { get; set; }
        
        public ICollection<RegisterUnsortResponse> RegisterUnsort { get; set; }
    }
}