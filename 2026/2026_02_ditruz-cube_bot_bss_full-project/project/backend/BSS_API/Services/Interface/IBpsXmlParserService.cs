namespace BSS_API.Services.Interface
{
    using Models.XmlModels;

    public interface IBpsXmlParserService
    {
        BpsXmlRoot ParseXml(string xmlContent);
    }
}
