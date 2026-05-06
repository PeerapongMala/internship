namespace BSS_WEB.Models.Common;

#region Sort

/// <summary>
/// Sort direction (Asc/Desc)
/// ทิศทางการเรียง
/// </summary>
public enum SortDirection
{
    /// <summary>Ascending / น้อยไปมาก</summary>
    Asc = 0,
    /// <summary>Descending / มากไปน้อย</summary>
    Desc = 1
}

/// <summary>
/// Sort condition for a field
/// เงื่อนไข sort ต่อ 1 ฟิลด์
/// </summary>
public sealed class SortRequest
{
    /// <summary>Field name / ชื่อฟิลด์ (จากฝั่ง client)</summary>
    public string Field { get; set; } = string.Empty;

    /// <summary>Direction / ทิศทาง</summary>
    public SortDirection Direction { get; set; } = SortDirection.Desc;
}

#endregion

#region Query (Non-Paging)

/// <summary>
/// Base request for query/search/sort/filter (NO paging)
/// Request กลางสำหรับ query ที่ไม่แบ่งหน้า (ใช้ได้ทั้งภายในระบบ / หน้าบ้าน)
/// </summary>
public class QueryRequest<TFilter>
    where TFilter : class?
{
    /// <summary>Global search keyword / คำค้นรวม</summary>
    public string? Search { get; set; }

    /// <summary>Multi-sort / sort หลายฟิลด์</summary>
    public List<SortRequest> Sorts { get; set; } = new();

    /// <summary>Strongly typed filter / filter แบบ strongly typed</summary>
    public TFilter? Filter { get; set; }
}

/// <summary>
/// Query request without filter
/// Request กลางแบบไม่ส่ง filter
/// </summary>
public sealed class QueryRequest : QueryRequest<object?>
{
}

#endregion

#region Paging

/// <summary>
/// Base request for paging/search/sort/filter
/// Request กลางสำหรับ Paging / Search / Sort / Filter
/// </summary>
public class PagedRequest<TFilter>
    where TFilter : class?
{
    /// <summary>Page number (start at 1) / หน้าเริ่มที่ 1</summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>Page size / จำนวนต่อหน้า</summary>
    public int PageSize { get; set; } = 100;

    /// <summary>Global search keyword / คำค้นรวม</summary>
    public string? Search { get; set; }

    /// <summary>Multi-sort / sort หลายฟิลด์</summary>
    public List<SortRequest> Sorts { get; set; } = new();

    /// <summary>Strongly typed filter / filter แบบ strongly typed</summary>
    public TFilter? Filter { get; set; }

    /// <summary>Skip (calculated) / จำนวนที่ข้าม</summary>
    public int Skip => PageNumber <= 1 ? 0 : (PageNumber - 1) * PageSize;

    /// <summary>Take (calculated) / จำนวนที่ดึง</summary>
    public int Take => PageSize;
}

/// <summary>
/// Paging request with additional payload
/// Request สำหรับ paging ที่แนบ payload เพิ่ม (เช่น option เพิ่มเติม)
/// </summary>
public class PagedRequest<TFilter, TPayload> : PagedRequest<TFilter>
    where TFilter : class?
    where TPayload : class?
{
    /// <summary>Extra payload / ข้อมูลพิเศษแนบมา</summary>
    public TPayload? Payload { get; set; }
}

/// <summary>
/// Paging request without filter
/// Request กลางแบบไม่ส่ง filter
/// </summary>
public sealed class PagedRequest : PagedRequest<object?>
{
}

#endregion
