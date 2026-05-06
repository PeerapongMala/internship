using System.Data;
using System.Text;
using System.Xml.Serialization;

namespace BSS_API.Helpers
{
    public class XmlHelper
    {

        public static void WriteObjectXmlFile<T>(T model, string path)
        {
            try
            {
                using (StreamWriter sw = new StreamWriter(path))
                {
                    new XmlSerializer(typeof(T)).Serialize(sw, model);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static T ReadXmlFileObject<T>(string path)
        {
            try
            {
                using (StreamReader sr = new StreamReader(path))
                {
                    object objXml = new XmlSerializer(typeof(T)).Deserialize(sr);

                    return (T)objXml;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static T ReadXmlTextObject<T>(string data)
        {
            try
            {
                using (MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(data)))
                {
                    object objXml = new XmlSerializer(typeof(T)).Deserialize(ms);

                    return (T)objXml;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static DataTable ReadXmlTextDataTable(string data)
        {
            try
            {
                StringReader theReader = new StringReader(data);
                DataSet dataSet = new DataSet();
                dataSet.ReadXml(theReader);

                DataTable dt = new DataTable();
                if (dataSet.Tables.Count > 0)
                {
                    dt = dataSet.Tables[0];
                }

                return dt;
            }
            catch
            {
                return new DataTable();
            }
        }

        public static DataSet ReadXmlTextDataSet(string data)
        {
            try
            {
                StringReader theReader = new StringReader(data);
                DataSet dataSet = new DataSet();
                dataSet.ReadXml(theReader);

                return dataSet;
            }
            catch
            {
                return new DataSet();
            }
        }

        public static string XmlTextDeclaration()
        {
            return @"<?xml version=""1.0"" encoding=""utf-8""?>";
        }
    }
}
