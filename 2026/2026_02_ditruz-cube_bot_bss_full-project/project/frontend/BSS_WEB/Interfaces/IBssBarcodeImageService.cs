namespace BSS_WEB.Interfaces
{
    public interface IBssBarcodeImageService
    {
        Task<string> GenerateBarcodeImageAsync(string barcodeString);
    }
}
