namespace BSS_API.Models.ResponseModels;

public class HoldingSummaryResponse
{
    public List<HoldingDenominationRow> Rows { get; set; } = new();

    /// <summary>รวมธนบัตร ดี/เสีย/ทำลาย ทั้งสิ้น (+)</summary>
    public int TotalGoodDamagedDestroy { get; set; }

    /// <summary>รวมธนบัตร Reject จำนวนทั้งสิ้น (+)</summary>
    public int TotalReject { get; set; }

    /// <summary>ธนบัตร ปลอม/ชำรุด จำนวนทั้งสิ้น (O)</summary>
    public int TotalCounterfeitDefect { get; set; }

    /// <summary>เกินจำนวน (ระบบ) จำนวนทั้งสิ้น (O)</summary>
    public int TotalExcess { get; set; }

    /// <summary>รวมทั้งสิ้น</summary>
    public int GrandTotal { get; set; }
}

public class HoldingDenominationRow
{
    /// <summary>ชนิดราคา e.g. 1000</summary>
    public int DenoPrice { get; set; }

    /// <summary>ประเภท e.g. ทำลาย, ดี, Reject, ปลอม</summary>
    public string BnType { get; set; } = string.Empty;

    /// <summary>ประเภท raw code e.g. G, D, R, C</summary>
    public string BnTypeCode { get; set; } = string.Empty;

    /// <summary>แบบ e.g. 17, 16, 99</summary>
    public string DenomSeries { get; set; } = string.Empty;

    /// <summary>จำนวนฉบับ</summary>
    public int Qty { get; set; }
}
