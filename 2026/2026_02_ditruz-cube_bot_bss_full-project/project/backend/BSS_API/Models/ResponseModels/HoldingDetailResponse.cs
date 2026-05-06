namespace BSS_API.Models.ResponseModels
{
    public class HoldingDetailResponse
    {
        public HoldingDetailPageInfo PageInfo { get; set; } = new();
        public HoldingDetailPanels Panels { get; set; } = new();
    }

    public class HoldingDetailPageInfo
    {
        public string Supervisor { get; set; } = "-";
        public string Machine { get; set; } = "-";
        public string Shift { get; set; } = "-";
    }

    public class HoldingDetailPanels
    {
        public List<HoldingDetailPanelRow> P1 { get; set; } = new();
        public List<HoldingDetailPanelRow> P2 { get; set; } = new();
        public List<HoldingDetailPanelRow> P4 { get; set; } = new();
        public List<HoldingDetailPanelRow> P5 { get; set; } = new();
        public List<HoldingDetailPanelRow> P6 { get; set; } = new();
        public int MachineExcessCount { get; set; }
    }

    public class HoldingDetailPanelRow
    {
        public string HeaderCard { get; set; } = "";
        public string Denomination { get; set; } = "";
        public string SortDate { get; set; } = "";
        public int Value { get; set; }
        public int Count { get; set; }
    }

    public class HoldingDetailByHcRow
    {
        public string HeaderCard { get; set; } = "";
        public string Denomination { get; set; } = "";
        public string Type { get; set; } = "";
        public string Series { get; set; } = "";
        public int SheetCount { get; set; }
        public int Value { get; set; }
    }
}
