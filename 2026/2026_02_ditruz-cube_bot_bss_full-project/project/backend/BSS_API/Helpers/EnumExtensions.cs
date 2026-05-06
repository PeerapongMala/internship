using System.Reflection;

namespace BSS_API.Helpers;

public static class EnumExtensions
{
    public static string DisplayName(this Enum value)
    {
        var field = value.GetType().GetField(value.ToString());
        if (field == null) return value.ToString();
        var attr = Attribute.GetCustomAttribute(field, typeof(EnumDisplayNameAttribute))
                   as EnumDisplayNameAttribute;
        return attr?.DisplayName ?? value.ToString();
    }

    public static string DisplayNameTH(this Enum value)
    {
        var field = value.GetType().GetField(value.ToString());
        if (field == null) return value.ToString();
        var attr = Attribute.GetCustomAttribute(field, typeof(EnumDisplayNameAttribute))
                   as EnumDisplayNameAttribute;
        return attr?.DisplayNameTH ?? value.ToString();
    }

    public static TEnum ToEnum<TEnum>(this string name) where TEnum : struct, Enum
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentNullException(nameof(name));

        static string NormalizeHyphens(string s) => s.Replace("-", "");

        var normInput = NormalizeHyphens(name);

        foreach (var field in typeof(TEnum).GetFields(BindingFlags.Public | BindingFlags.Static))
        {
            var attr = Attribute.GetCustomAttribute(field, typeof(EnumDisplayNameAttribute))
                       as EnumDisplayNameAttribute;

            if (attr != null)
            {
                if (string.Equals(attr.DisplayName, name, StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(NormalizeHyphens(attr.DisplayName), normInput, StringComparison.OrdinalIgnoreCase))
                    return (TEnum)field.GetValue(null)!;

                if (attr.DisplayNameTH == name)
                    return (TEnum)field.GetValue(null)!;
            }
            else
            {
                if (string.Equals(field.Name, name, StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(NormalizeHyphens(field.Name), normInput, StringComparison.OrdinalIgnoreCase))
                    return (TEnum)field.GetValue(null)!;
            }
        }

        throw new ArgumentException($"ไม่พบค่า {typeof(TEnum).Name} ที่ชื่อ '{name}'", nameof(name));
    }

    public static int ToInt(this Enum value) => Convert.ToInt32(value);

    public static int ToInt<TEnum>(this string name) where TEnum : struct, Enum
        => Convert.ToInt32(name.ToEnum<TEnum>());

    public static int ToInt<TEnum>(this object input) where TEnum : struct, Enum
    {
        if (input is null) throw new ArgumentNullException(nameof(input));

        if (input is TEnum e) return Convert.ToInt32(e);
        if (input is Enum anyEnum) return Convert.ToInt32(anyEnum); // เผื่อส่ง Enum มาแต่ไม่ใช่ TEnum

        if (input is string s) return s.ToInt<TEnum>();

        throw new ArgumentException($"รองรับเฉพาะ Enum หรือ string เท่านั้น แต่เจอ {input.GetType().Name}", nameof(input));
    }

    public static Dictionary<int, EnumMeta> ToMetaDictionary<TEnum>()
       where TEnum : struct, Enum
    {
        var dict = new Dictionary<int, EnumMeta>();

        foreach (var f in typeof(TEnum).GetFields(BindingFlags.Public | BindingFlags.Static))
        {
            var attr = f.GetCustomAttribute<EnumDisplayNameAttribute>();
            if (attr == null)
                throw new InvalidOperationException(
                    $"{typeof(TEnum).Name}.{f.Name} ต้องมี EnumDisplayNameAttribute");

            dict[attr.Key] = new EnumMeta(
                attr.Key,
                attr.DisplayName,
                attr.DisplayNameTH
            );
        }

        return dict;
    }
}
public class EnumDisplayNameAttribute : Attribute
{
    public int Key { get; init; }
    public string DisplayName { get; init; } = "";
    public string DisplayNameTH { get; init; } = "";
}

public sealed record EnumMeta(
    int Key,
    string DisplayName,
    string DisplayNameTH
);
