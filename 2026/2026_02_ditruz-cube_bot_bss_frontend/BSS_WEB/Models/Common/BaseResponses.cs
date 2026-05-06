namespace BSS_WEB.Models.Common;

#region Base Response

/// <summary>
/// Base API response (no data)
/// Response พื้นฐาน (ไม่มีข้อมูล)
/// </summary>
public class ApiResponse
{
    /// <summary>Success flag / สำเร็จหรือไม่</summary>
    public bool is_success { get; set; }
    public string msg_code { get; set; } = string.Empty;
    public string msg_desc { get; set; } = string.Empty;

    /// <summary>Meta (optional) / ข้อมูลเสริม</summary>
    public Dictionary<string, object?> Meta { get; set; } = new();
}

/// <summary>
/// Base API response with data
/// Response พื้นฐาน (มีข้อมูลใน Data)
/// </summary>
public class ApiResponse<TData> : ApiResponse
{
    /// <summary>Response data / ข้อมูลที่ได้</summary>
    public TData? Data { get; set; }
}

#endregion

#region Paging (Data = PagedData<T>)

/// <summary>
/// Container for paged result
/// กล่องข้อมูลแบบแบ่งหน้า
/// </summary>
public class PagedData<TItem>
{
    /// <summary>Items / รายการในหน้านี้</summary>
    public IReadOnlyList<TItem> Items { get; set; } = Array.Empty<TItem>();

    /// <summary>Total count / จำนวนทั้งหมดก่อนแบ่งหน้า</summary>
    public int TotalCount { get; set; }

    /// <summary>Page number / หน้าปัจจุบัน</summary>
    public int PageNumber { get; set; }

    /// <summary>Page size / จำนวนต่อหน้า</summary>
    public int PageSize { get; set; }

    /// <summary>Total pages / จำนวนหน้าทั้งหมด</summary>
    public int TotalPages =>
        PageSize <= 0 ? 0 : (int)Math.Ceiling((double)TotalCount / PageSize);

    /// <summary>Has next page / มีหน้าถัดไปไหม</summary>
    public bool HasNextPage => PageNumber < TotalPages;

    /// <summary>Has previous page / มีหน้าก่อนหน้าไหม</summary>
    public bool HasPreviousPage => PageNumber > 1;
}

/// <summary>
/// Response for paged result
/// Response แบบ paging (ข้อมูลอยู่ใน Data)
/// </summary>
public class PagedResponse<TItem> : ApiResponse<PagedData<TItem>>
{
}

#endregion

#region Optional Error Detail

/// <summary>
/// Optional error detail / รายละเอียด error เพิ่มเติม
/// </summary>
public class ErrorDetail
{
    public int? Status { get; set; }
    public string? Round { get; set; }
    public string? Task { get; set; }
    public string? SystemErrorDescription { get; set; }
    public int? RunId { get; set; }
    public int? Rows { get; set; }
    public List<string> MessageLogs { get; set; } = new();
}

/// <summary>
/// Response with optional error detail
/// </summary>
public class ApiResponseWithDetail<TData> : ApiResponse<TData>
{
    public ErrorDetail? Detail { get; set; }
}

#endregion
