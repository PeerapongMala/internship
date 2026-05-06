namespace BSS_API.Core.JsonConverter
{
    using Newtonsoft.Json;
    using System.Globalization;

    public class StrictDateTimeConverter : JsonConverter<DateTime?>
    {
        private static readonly string[] Formats =
        {
            "yyyy-MM-dd'T'HH:mm:ss'Z'",
            "yyyy-MM-dd'T'HH:mm:ss.F'Z'",
            "yyyy-MM-dd'T'HH:mm:ss.FF'Z'",
            "yyyy-MM-dd'T'HH:mm:ss.FFF'Z'"
        };

        public override DateTime? ReadJson(
            JsonReader reader,
            Type objectType,
            DateTime? existingValue,
            bool hasExistingValue,
            JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null)
                return null;

            // ⭐ JSON.NET แปลง ISO-8601 เป็น DateTime ให้แล้ว
            if (reader.TokenType == JsonToken.Date)
            {
                var dt = (DateTime)reader.Value!;
                return DateTime.SpecifyKind(dt, DateTimeKind.Utc);
            }

            if (reader.TokenType != JsonToken.String)
                throw new JsonSerializationException(
                    $"send_date must be a string or ISO-8601 date, but was {reader.TokenType}");

            var value = reader.Value!.ToString();

            if (!DateTime.TryParseExact(
                    value,
                    Formats,
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                    out var date))
            {
                throw new JsonSerializationException(
                    "send_date must be ISO-8601 UTC (e.g. 2024-02-05T09:49:00Z)");
            }

            return date;
        }

        public override void WriteJson(
            JsonWriter writer,
            DateTime? value,
            JsonSerializer serializer)
        {
            if (value.HasValue)
            {
                writer.WriteValue(
                    value.Value
                        .ToUniversalTime()
                        .ToString("yyyy-MM-dd'T'HH:mm:ss'Z'",
                            CultureInfo.InvariantCulture));
            }
            else
            {
                writer.WriteNull();
            }
        }
    }
}