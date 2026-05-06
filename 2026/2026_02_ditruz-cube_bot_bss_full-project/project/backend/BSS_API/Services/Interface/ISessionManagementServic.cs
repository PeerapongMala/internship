namespace BSS_API.Services.Interface
{
    public interface ISessionManagementServic
    {
        Task<string?> GetSessionTokenVersion(string userId);
    }
}
