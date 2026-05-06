namespace BSS_WEB.Models.ServiceModel
{
    public class CreateSendUnsortResult
    {
        public ICollection<string> ContaineCode { get; set; }

        public ICollection<RegisterUnsortResult> RegisterUnsort { get; set; }
    }
}
