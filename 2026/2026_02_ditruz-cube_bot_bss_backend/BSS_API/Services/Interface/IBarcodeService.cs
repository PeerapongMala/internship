namespace BSS_API.Services.Interface
{
    using Core.Constants;
    using Models.ResponseModels;

    public interface IBarcodeService
    {
        Task<ValidateBarcodeResponse?> ValidateAsync();

        Task GenerateBarcodeAsync(BNType bnType, bool isGenerateBarcodeWrap = true,
            bool isValidateAfterGenerate = false);

        Task<BarcodePreviewResponse?> PreviewGenerateBarcodeAsync(BNType bnType, bool isFirstScan = true);

        Task GenerateBarcodeVersion2Async(BNType bnType, bool isFirstScan = true, bool isValidateAfterGenerate = false);

        Task ImportCbmsGenerateBarcodeAsync(bool isValidateAfterGenerate = false);

        Task<string> GenerateSequenceNumberAsync(GenerateSequenceTypeEnum generateSequenceType, string oldRunningNumber,
            string? prefix = null);
    }
}