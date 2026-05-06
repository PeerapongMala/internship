using Newtonsoft.Json;

namespace BSS_API.Helpers
{
    public class JsonHelper
    {
        public static string SerializeObject(object data)
        {
            try
            {
                string strJson = JsonConvert.SerializeObject(data);

                return strJson;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static T DeserializeObject<T>(string data)
        {
            try
            {
                T obj = JsonConvert.DeserializeObject<T>(data);

                return obj;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
