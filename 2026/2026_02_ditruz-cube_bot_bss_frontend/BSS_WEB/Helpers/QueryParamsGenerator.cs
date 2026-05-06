using System.Collections;
using System.Globalization;
using System.Reflection;
using System.Text.Json;

namespace BSS_WEB.Helpers;

public static class QueryParamsGenerator
{
    /// <summary>
    /// Generate query string from object
    /// - camelCase key (JsonNamingPolicy)
    /// - list => repeat key only (a=1&a=2)
    /// - skipEmpty = true : skip null, "", whitespace, zero
    /// - skipEmpty = false: include everything
    /// </summary>
    public static string ToQueryString(
        this object obj,
        bool skipEmpty = true)
    {
        if (obj is null)
            throw new ArgumentNullException(nameof(obj));

        var naming = JsonNamingPolicy.CamelCase;
        var pairs = new List<string>();

        var props = obj.GetType()
            .GetProperties(BindingFlags.Instance | BindingFlags.Public)
            .Where(p => p.CanRead);

        foreach (var p in props)
        {
            var raw = p.GetValue(obj);
            var key = Uri.EscapeDataString(naming.ConvertName(p.Name));

            // ===== null =====
            if (raw is null)
            {
                if (!skipEmpty)
                    pairs.Add($"{key}=");
                continue;
            }

            // ===== string =====
            if (raw is string s)
            {
                if (skipEmpty && string.IsNullOrWhiteSpace(s))
                    continue;

                pairs.Add($"{key}={Uri.EscapeDataString(s)}");
                continue;
            }

            // ===== IEnumerable (List, Array) =====
            if (raw is IEnumerable enumerable && raw is not string)
            {
                var hasValue = false;

                foreach (var item in enumerable)
                {
                    if (item is null)
                    {
                        if (!skipEmpty)
                        {
                            pairs.Add($"{key}=");
                            hasValue = true;
                        }
                        continue;
                    }

                    if (item is string si)
                    {
                        if (skipEmpty && string.IsNullOrWhiteSpace(si))
                            continue;

                        pairs.Add($"{key}={Uri.EscapeDataString(si)}");
                        hasValue = true;
                        continue;
                    }

                    if (skipEmpty && IsZeroNumber(item))
                        continue;

                    pairs.Add($"{key}={Uri.EscapeDataString(ConvertToString(item))}");
                    hasValue = true;
                }

                if (!hasValue && !skipEmpty)
                    pairs.Add($"{key}=");

                continue;
            }

            // ===== number zero =====
            if (skipEmpty && IsZeroNumber(raw))
                continue;

            pairs.Add($"{key}={Uri.EscapeDataString(ConvertToString(raw))}");
        }

        return string.Join("&", pairs);
    }

    /// <summary>ข้าม null, "", 0</summary>
    public static string ToQueryParamStringSkipEmpty(this object obj)
        => obj.ToQueryString(skipEmpty: true);

    /// <summary>รวมทุกค่า</summary>
    public static string ToQueryParamStringIncludeEmpty(this object obj)
        => obj.ToQueryString(skipEmpty: false);

    private static string ConvertToString(object value)
    {
        return value switch
        {
            DateTime dt => dt.ToString("o", CultureInfo.InvariantCulture),
            DateTimeOffset dto => dto.ToString("o", CultureInfo.InvariantCulture),
            bool b => b ? "true" : "false",
            IFormattable f => f.ToString(null, CultureInfo.InvariantCulture) ?? "",
            _ => value.ToString() ?? ""
        };
    }

    private static bool IsZeroNumber(object value)
    {
        return value switch
        {
            byte v => v == 0,
            short v => v == 0,
            int v => v == 0,
            long v => v == 0,
            float v => v == 0,
            double v => v == 0,
            decimal v => v == 0,
            _ => false
        };
    }
}
