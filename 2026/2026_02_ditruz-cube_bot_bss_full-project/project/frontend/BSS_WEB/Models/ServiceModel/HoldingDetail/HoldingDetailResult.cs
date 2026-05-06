namespace BSS_WEB.Models.ServiceModel.HoldingDetail
{
    public class HoldingDetailResult
    {
        public HoldingDetailPageInfoResult PageInfo { get; set; } = new();
        public HoldingDetailPanelsResult Panels { get; set; } = new();
    }

    public class HoldingDetailPageInfoResult
    {
        public string Supervisor { get; set; } = "-";
        public string Machine { get; set; } = "-";
        public string Shift { get; set; } = "-";
    }

    public class HoldingDetailPanelsResult
    {
        public List<HoldingDetailPanelRowResult> P1 { get; set; } = new();
        public List<HoldingDetailPanelRowResult> P2 { get; set; } = new();
        public List<HoldingDetailPanelRowResult> P4 { get; set; } = new();
        public List<HoldingDetailPanelRowResult> P5 { get; set; } = new();
        public List<HoldingDetailPanelRowResult> P6 { get; set; } = new();
        public int MachineExcessCount { get; set; }
    }

    public class HoldingDetailPanelRowResult
    {
        public string HeaderCard { get; set; } = "";
        public string Denomination { get; set; } = "";
        public string SortDate { get; set; } = "";
        public int Value { get; set; }
        public int Count { get; set; }
    }

    public class HoldingDetailByHcRowResult
    {
        public string HeaderCard { get; set; } = "";
        public string Denomination { get; set; } = "";
        public string Type { get; set; } = "";
        public string Series { get; set; } = "";
        public int SheetCount { get; set; }
        public int Value { get; set; }
    }
}
