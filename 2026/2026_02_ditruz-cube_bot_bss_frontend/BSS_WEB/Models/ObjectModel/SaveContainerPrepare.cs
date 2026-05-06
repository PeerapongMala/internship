namespace BSS_WEB.Models.ObjectModel
{
    public class SaveContainerPrepare
    {
        public int machineId { get; set; } = 0;

        public int departmentId { get; set; } = 0;

        public long receiveId { get; set; } = 0;

        public string? containerCode { get; set; }

        public string headerCardCode { get; set; }

        public string packageCode { get; set; }

        public string bundleCode { get; set; }

        public int createdBy { get; set; }

        public int updatedBy { get; set; }



    }

}
