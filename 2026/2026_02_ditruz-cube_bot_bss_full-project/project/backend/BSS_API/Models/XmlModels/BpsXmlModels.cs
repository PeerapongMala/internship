namespace BSS_API.Models.XmlModels
{
    using System.Xml.Serialization;

    [XmlRoot("BPS")]
    public class BpsXmlRoot
    {
        [XmlAttribute("Created")]
        public string Created { get; set; } = string.Empty;

        [XmlElement("Machine")]
        public BpsXmlMachine Machine { get; set; } = new();
    }

    public class BpsXmlMachine
    {
        [XmlAttribute("SerialNumber")]
        public string SerialNumber { get; set; } = string.Empty;

        [XmlAttribute("Site")]
        public string Site { get; set; } = string.Empty;

        [XmlAttribute("SoftwareRelease")]
        public string SoftwareRelease { get; set; } = string.Empty;

        [XmlAttribute("Type")]
        public string Type { get; set; } = string.Empty;

        [XmlAttribute("Name")]
        public string Name { get; set; } = string.Empty;

        [XmlElement("ParameterSection")]
        public List<BpsXmlParameterSection> ParameterSections { get; set; } = [];
    }

    public class BpsXmlParameterSection
    {
        [XmlAttribute("Number")]
        public string Number { get; set; } = string.Empty;

        [XmlAttribute("StartTime")]
        public string StartTime { get; set; } = string.Empty;

        [XmlAttribute("EndTime")]
        public string EndTime { get; set; } = string.Empty;

        [XmlAttribute("ContainerID")]
        public string ContainerID { get; set; } = string.Empty;

        [XmlElement("Operator")]
        public BpsXmlOperator? Operator { get; set; }

        [XmlElement("HeadercardUnit")]
        public List<BpsXmlHeadercardUnit> HeadercardUnits { get; set; } = [];
    }

    public class BpsXmlOperator
    {
        [XmlAttribute("Name")]
        public string Name { get; set; } = string.Empty;

        [XmlText]
        public string Value { get; set; } = string.Empty;
    }

    public class BpsXmlHeadercardUnit
    {
        [XmlAttribute("HeaderCardID")]
        public string HeaderCardID { get; set; } = string.Empty;

        [XmlAttribute("DepositID")]
        public string DepositID { get; set; } = string.Empty;

        [XmlAttribute("StartTime")]
        public string StartTime { get; set; } = string.Empty;

        [XmlAttribute("MilliSec")]
        public string MilliSec { get; set; } = string.Empty;

        [XmlAttribute("EndTime")]
        public string EndTime { get; set; } = string.Empty;

        [XmlAttribute("Rejects")]
        public string Rejects { get; set; } = string.Empty;

        [XmlElement("Counter")]
        public List<BpsXmlCounter> Counters { get; set; } = [];
    }

    public class BpsXmlCounter
    {
        [XmlAttribute("DenomID")]
        public string DenomID { get; set; } = string.Empty;

        [XmlAttribute("DenomName")]
        public string DenomName { get; set; } = string.Empty;

        [XmlAttribute("Currency")]
        public string Currency { get; set; } = string.Empty;

        [XmlAttribute("Value")]
        public string Value { get; set; } = string.Empty;

        [XmlAttribute("Quality")]
        public string Quality { get; set; } = string.Empty;

        [XmlAttribute("Issue")]
        public string Issue { get; set; } = string.Empty;

        [XmlAttribute("Output")]
        public string Output { get; set; } = string.Empty;

        [XmlAttribute("Number")]
        public int Number { get; set; }
    }
}
