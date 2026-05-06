namespace BSS_API.Services.Interface
{
    public interface IFtpService
    {
        Task<List<string>> ListXmlFilesAsync(string remotePath);
        Task<string> DownloadFileContentAsync(string filePath);
        Task MoveFileAsync(string sourcePath, string destPath);
        Task EnsureDirectoryExistsAsync(string path);
    }
}
