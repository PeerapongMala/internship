namespace BSS_WEB.Models.ObjectModel
{
    public class SaveOperationSettingRequest
    {
        public string banknoteTypeSelected { get; set; } = string.Empty;
        public string operationSelected { get; set; } = string.Empty;
        public string machineSelected { get; set; } = string.Empty;
        public string sorterSelected { get; set; } = string.Empty;
        public int userId { get; set; } = 0;
    }
}
