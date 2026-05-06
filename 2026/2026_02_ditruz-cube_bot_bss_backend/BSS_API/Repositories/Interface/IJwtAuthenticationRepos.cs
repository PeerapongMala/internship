namespace BSS_API.Repositories.Interface
{
    public interface IJwtAuthenticationRepos
    {
        Task<string> GenerateTokenAsync(string username, string rolename);
    }
}
