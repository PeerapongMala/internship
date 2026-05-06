using System.Net;
using System.Net.Http.Headers;
using System.Text;

namespace BSS_API.Helpers
{
    public class NetworkHelper
    {
        public static string GetIPAddress()
        {
            try
            {
                IPHostEntry heserver = Dns.GetHostEntry(Dns.GetHostName());
                string ipAddress = heserver.AddressList.ToList().Where(p => p.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork).FirstOrDefault().ToString();

                return ipAddress;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static string requestHttpWebApi(string httpUrl, string httpHeaderName, string httpHeaderValue, string httpMethod, string httpContent)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    if (!string.IsNullOrEmpty(httpHeaderName) && !string.IsNullOrEmpty(httpHeaderValue))
                    {
                        client.DefaultRequestHeaders.Add(httpHeaderName, httpHeaderValue);
                    }

                    HttpContent content = new StringContent(httpContent, Encoding.UTF8, "application/json");

                    HttpResponseMessage response = new HttpResponseMessage();
                    switch (httpMethod.ToUpper())
                    {
                        case "GET": response = client.GetAsync(httpUrl).Result; break;
                        case "POST": response = client.PostAsync(httpUrl, content).Result; break;
                        case "PUT": response = client.PutAsync(httpUrl, content).Result; break;
                        case "PATCH": response = client.PatchAsync(httpUrl, content).Result; break;
                        case "DELETE": response = client.DeleteAsync(httpUrl).Result; break;
                    }

                    string result = string.Empty;
                    if (response.IsSuccessStatusCode)
                    {
                        result = response.Content.ReadAsStringAsync().Result;
                    }
                    else
                    {
                        throw new Exception(response.ReasonPhrase);
                    }

                    return result;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static string requestHttpBasicAuthen(string httpUrl, string httpMethod, string username, string password)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                                                                        "Basic", Convert.ToBase64String(
                                                                            System.Text.ASCIIEncoding.ASCII.GetBytes(
                                                                               $"{username}:{password}")));
                    HttpResponseMessage response = new HttpResponseMessage();
                    switch (httpMethod.ToUpper())
                    {
                        case "GET": response = client.GetAsync(httpUrl).Result; break;
                    }

                    string result = string.Empty;
                    if (response.IsSuccessStatusCode)
                    {
                        result = response.Content.ReadAsStringAsync().Result;
                    }
                    else
                    {
                        throw new Exception(response.ReasonPhrase);
                    }

                    return result;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static string requestHttpWebService(string httpUrl, string httpMethod, string httpContent)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpContent content = new StringContent(httpContent, Encoding.UTF8, "application/x-www-form-urlencoded");

                    HttpResponseMessage response = new HttpResponseMessage();
                    switch (httpMethod.ToUpper())
                    {
                        case "POST": response = client.PostAsync(httpUrl, content).Result; break;
                    }

                    string result = string.Empty;
                    if (response.IsSuccessStatusCode)
                    {
                        result = response.Content.ReadAsStringAsync().Result;
                    }
                    else
                    {
                        throw new Exception(response.ReasonPhrase);
                    }

                    return result;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static async Task<string> RequestHttpWebServiceGetCertificateAsync(string httpUrl, string sCertificate)
        {
            try
            {
                using (HttpClient client = new HttpClient()) {

                    var formContent = new FormUrlEncodedContent(new[] { new KeyValuePair<string, string>("sCertificate", sCertificate) });

                    string result = string.Empty;
                    HttpResponseMessage? response;

                    response = await client.PostAsync(httpUrl, formContent);
                    //response.EnsureSuccessStatusCode();

                    if (response.IsSuccessStatusCode)
                    {
                        result = await response.Content.ReadAsStringAsync();
                    }
                    else
                    {
                        result = response.ReasonPhrase ?? string.Empty;
                    }

                    return result;
                }
            }
            catch (Exception ex)
            {
                // Log ได้ถ้าต้องการ
                throw new Exception("Error calling web service", ex);
            }
        }


        public static string requestHttpServiceSoap(string httpUrl, string httpMethod, string httpContent)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpContent content = new StringContent(httpContent, Encoding.UTF8, "application/soap+xml");

                    HttpResponseMessage response = new HttpResponseMessage();
                    switch (httpMethod.ToUpper())
                    {
                        case "POST": response = client.PostAsync(httpUrl, content).Result; break;
                    }

                    string result = string.Empty;
                    if (response.IsSuccessStatusCode)
                    {
                        result = response.Content.ReadAsStringAsync().Result;
                    }
                    else
                    {
                        throw new Exception(response.ReasonPhrase);
                    }

                    return result;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
