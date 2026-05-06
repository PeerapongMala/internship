namespace BSS_API.Services
{
    using FluentFTP;
    using Helpers;
    using Interface;
    using Microsoft.Extensions.Logging;

    public class FtpService(ILogger<FtpService> logger) : IFtpService
    {
        private AsyncFtpClient CreateClient()
        {
            var host = AppConfig.FtpHost;
            var port = AppConfig.FtpPort;
            var user = AppConfig.FtpUser;
            var password = AppConfig.FtpPassword;

            var client = new AsyncFtpClient(host, user, password, port, new FtpConfig());
            return client;
        }

        public async Task<List<string>> ListXmlFilesAsync(string remotePath)
        {
            using var client = CreateClient();
            await client.Connect();

            var items = await client.GetListing(remotePath);
            var xmlFiles = items
                .Where(x => x.Type == FtpObjectType.File &&
                            x.Name.EndsWith(".xml", StringComparison.OrdinalIgnoreCase))
                .Select(x => x.FullName)
                .ToList();

            await client.Disconnect();
            return xmlFiles;
        }

        public async Task<string> DownloadFileContentAsync(string filePath)
        {
            using var client = CreateClient();
            await client.Connect();

            using var stream = new MemoryStream();
            await client.DownloadStream(stream, filePath);
            stream.Position = 0;

            using var reader = new StreamReader(stream);
            var content = await reader.ReadToEndAsync();

            await client.Disconnect();
            return content;
        }

        public async Task MoveFileAsync(string sourcePath, string destPath)
        {
            using var client = CreateClient();
            await client.Connect();

            var success = await client.MoveFile(sourcePath, destPath, FtpRemoteExists.Overwrite);
            if (!success)
            {
                logger.LogWarning("Failed to move file from {Source} to {Dest}", sourcePath, destPath);
            }

            await client.Disconnect();
        }

        public async Task EnsureDirectoryExistsAsync(string path)
        {
            using var client = CreateClient();
            await client.Connect();

            if (!await client.DirectoryExists(path))
            {
                await client.CreateDirectory(path);
            }

            await client.Disconnect();
        }
    }
}
