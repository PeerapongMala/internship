namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class PreparationUnfitModel
    {
    }

    public class PreparationUnfitDataTableModel
    {
        public int Id { get; set; }

        public string WarpBarCode { get; set; } = string.Empty;

        public string BundleBarCode { get; set; } = string.Empty;

        public string HeaderCard { get; set; } = string.Empty;

        public string BankName { get; set; } = string.Empty;

        public string CashCenter { get; set; } = string.Empty;

        public DateTime PreparationTime { get; set; }

        public string ContainerBarcode { get; set; } = string.Empty;
    }
}
