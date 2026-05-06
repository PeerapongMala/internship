namespace BSS_API.Models.RequestModels
{
    public class RegisterUnsortDropdownRequest
    {
        public string InstitutionFilter { get; set; } = string.Empty;
        public string DenominationFilter { get; set; } = string.Empty;
        public string StatusFilter { get; set; } = string.Empty;

    }
}
