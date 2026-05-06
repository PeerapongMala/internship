namespace BSS_API.Core.JsonConverter
{
    using Newtonsoft.Json;

    public class StringOnlyConverter : JsonConverter<string>
    {
        public override string ReadJson(
            JsonReader reader,
            Type objectType,
            string existingValue,
            bool hasExistingValue,
            JsonSerializer serializer)
        {
            if (reader.TokenType != JsonToken.String)
            {
                throw new JsonSerializationException("invalid input data – The required field cb_bdc_code is missing");
            }

            return (string)reader.Value;
        }

        public override void WriteJson(
            JsonWriter writer,
            string value,
            JsonSerializer serializer)
        {
            writer.WriteValue(value);
        }
    }
}