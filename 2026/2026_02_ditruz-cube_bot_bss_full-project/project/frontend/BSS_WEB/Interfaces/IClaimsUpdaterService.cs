namespace BSS_WEB.Interfaces
{
    public interface IClaimsUpdaterService
    {
        Task UpdateClaimAsync(string type, string value);
    }
}
