namespace BSS_API.Services
{
    using System.Xml.Serialization;
    using Interface;
    using Models.XmlModels;

    public class BpsXmlParserService : IBpsXmlParserService
    {
        private static readonly XmlSerializer _serializer = new(typeof(BpsXmlRoot));

        public BpsXmlRoot ParseXml(string xmlContent)
        {
            using var reader = new StringReader(xmlContent);
            var result = _serializer.Deserialize(reader) as BpsXmlRoot;
            return result ?? throw new InvalidOperationException("Failed to parse BPS XML content.");
        }
    }
}
