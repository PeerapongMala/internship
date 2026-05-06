using Azure;
using Azure.Core;
using BSS_API.Helpers;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Models.ServiceModels;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Math;
using DocumentFormat.OpenXml.Spreadsheet;
using Newtonsoft.Json;
using System.Data;
using System.Net.NetworkInformation;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Linq;

namespace BSS_API.Services.Implementation
{
    public class BssAuthenticationService : IBssAuthenticationService
    {
        private readonly IAppShare _share;
        private readonly IAppClient _appClient;
        public BssAuthenticationService(IAppShare share, IAppClient appClient)
        {
            _share = share;
            _appClient = appClient;
        }

        #region /* BOT AD WS */

        public async Task<GetUserByLogonNameResult> GetUserByLogonName(string logonName)
        {
            var response = new GetUserByLogonNameResult();
            var dataRequest = new { userName = logonName };
            string xmlDataResult = string.Empty;
            try
            {
                string httpContent = string.Format("LogonName={0}", logonName);
                string url = string.Format("{0}/{1}", AppConfig.BotAdBaseUrl, AppConfig.BotADGetUserByLogonName);

                if (AppConfig.IsMockFlag == "N")
                {
                    xmlDataResult = NetworkHelper.requestHttpWebService(url, "POST", httpContent);
                }
                else
                {
                    xmlDataResult = MockDataHelper.GetUserByLogonNameMock();

                }

                _share.LogInformation($"STEP2: Call Xml Data from Service or Mock");

                if (xmlDataResult == null ||
                    xmlDataResult.Trim() == string.Empty ||
                    xmlDataResult.Trim() == XmlHelper.XmlTextDeclaration())
                {
                    response.data = null;
                    response.SetResponseDataNotFound("ไม่พบข้อมูล XML");
                    return await Task.FromResult(response);
                }

                _share.LogInformation($"STEP3: Load Xml Data ");
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(xmlDataResult);
                XmlNodeList xmlUserLists = xmlDoc.GetElementsByTagName("User");
                // XmlNodeList xmlUserLists = xml.SelectNodes("/AD/User");
                bool isHasData = (xmlDoc.InnerText != null && xmlDoc.InnerText != string.Empty) ? true : false;

                if (isHasData)
                {
                    _share.LogInformation($"STEP4: isHasData ");
                    var adUsers = await LoadXmlInternalUserData(xmlUserLists);
                    if (adUsers == null)
                    {
                        _share.LogInformation($"STEP5: No Users ");
                        response.data = null;
                        response.SetResponseDataNotFound("ไม่พบข้อมูล");
                        return await Task.FromResult(response);
                    }


                    _share.LogInformation($"STEP5: Check Users ");
                    var user = adUsers.Where(u => u.LogonName?.ToLower().Trim() == logonName.ToLower().Trim() && u.Status == "1").FirstOrDefault();
                    if (user == null)
                    {
                        _share.LogInformation($"STEP6: User Status Inactive.");
                        response.data = null;
                        response.SetResponseDataNotFound("ไม่พบข้อมูล");
                        return await Task.FromResult(response);
                    }

                    var userData = new UserInternalAuthenData()
                    {
                        ObjectGUID = user?.ObjectGUID,
                        Status = user?.Status,
                        AccountType = user?.AccountType,
                        ThaiFullName = user?.ThaiFullName,
                        EnglishFullName = user?.EnglishFullName,
                        ThaiFirstName = user?.ThaiFirstName,
                        ThaiLastName = user?.ThaiLastName,
                        EnglishFirstName = user?.EnglishFirstName,
                        EnglishLastName = user?.EnglishLastName,
                        Department = user?.Department,
                        Email = user?.Email,
                        LogonName = user?.LogonName,
                        ErrorMessage = user?.ErrorMessage
                    };

                    _share.LogInformation($"STEP6: Set userData ");
                    response.SetResponseSuccess();
                    response.data = userData;
                }
                else
                {
                    _share.LogInformation($"STEP4: Not HasData ");
                    response.data = null;
                    response.SetResponseDataNotFound("ไม่พบข้อมูล XML");
                }

                return await Task.FromResult(response);
            }
            catch (Exception ex)
            {
                response.SetResponseInternalServiceError(ex.GetErrorMessage());
            }

            return await Task.FromResult(response);
        }

        public async Task<GetUsersByGuidResult> GetUsersByGuid(string guid)
        {
            var response = new GetUsersByGuidResult();
            var dataRequest = new { GUIDs = guid };
            string xmlDataResult = string.Empty;
            try
            {
                _share.LogInformation($"STEP1: Service GetUsersByGuid");

                string httpContent = string.Format("GUIDs={0}", guid);
                string url = string.Format("{0}/{1}", AppConfig.BotAdBaseUrl, AppConfig.BotADGetUsersByGuid);

                if (AppConfig.IsMockFlag == "N")
                {
                    xmlDataResult = NetworkHelper.requestHttpWebService(url, "POST", httpContent);
                }
                else
                {
                    xmlDataResult = MockDataHelper.GetUsersByGuidMock();
                }

                _share.LogInformation($"STEP2: Call Xml Data from Service");

                if (xmlDataResult == null ||
                    xmlDataResult.Trim() == string.Empty ||
                    xmlDataResult.Trim() == XmlHelper.XmlTextDeclaration())
                {
                    response.data = null;
                    response.SetResponseDataNotFound("ไม่พบข้อมูล XML");
                    return await Task.FromResult(response);
                }

                _share.LogInformation($"STEP3: Load Xml Data ");
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(xmlDataResult);
                XmlNodeList xmlUserLists = xmlDoc.GetElementsByTagName("User");
                // XmlNodeList xmlUserLists = xml.SelectNodes("/AD/User");
                bool isHasData = (xmlDoc.InnerText != null && xmlDoc.InnerText != string.Empty) ? true : false;

                if (isHasData)
                {
                    _share.LogInformation($"STEP4: isHasData ");

                    var adUsers = await LoadXmlInternalUserData(xmlUserLists);
                    if (adUsers == null)
                    {
                        _share.LogInformation($"STEP5: User Not Found.");
                        response.data = null;
                        response.SetResponseDataNotFound("ไม่พบข้อมูล");
                        return await Task.FromResult(response);
                    }

                    var activeUser = adUsers.FirstOrDefault();
                    if (activeUser == null || !string.IsNullOrWhiteSpace(activeUser.ErrorMessage))
                    {
                        _share.LogInformation($"STEP5: User Status Inactive or GUID Not Found.");
                        response.data = null;
                        response.SetResponseDataNotFound("ไม่พบข้อมูล");
                        return await Task.FromResult(response);

                    }

                    var userData = new UserInternalAuthenData()
                    {
                        ObjectGUID = activeUser?.ObjectGUID,
                        Status = activeUser?.Status,
                        AccountType = activeUser?.AccountType,
                        ThaiFullName = activeUser?.ThaiFullName,
                        EnglishFullName = activeUser?.EnglishFullName,
                        ThaiFirstName = activeUser?.ThaiFirstName,
                        ThaiLastName = activeUser?.ThaiLastName,
                        EnglishFirstName = activeUser?.EnglishFirstName,
                        EnglishLastName = activeUser?.EnglishLastName,
                        Department = activeUser?.Department,
                        Email = activeUser?.Email,
                        LogonName = activeUser?.LogonName,
                        ErrorMessage = activeUser?.ErrorMessage
                    };

                    _share.LogInformation($"STEP5: Set userData ");
                    response.SetResponseSuccess();
                    response.data = userData;
                }
                else
                {
                    _share.LogInformation($"STEP4: XML InnerText Empty.");
                    response.data = null;
                    response.SetResponseDataNotFound("ไม่พบข้อมูล XML");
                }

                return await Task.FromResult(response);

            }
            catch (Exception ex)
            {
                response.SetResponseInternalServiceError(ex.GetErrorMessage());
            }

            return await Task.FromResult(response);
        }

        public async Task<GetAllInOUAccountByDisplayNamesResult> GetAllInOUAccountByDisplayNames(string displayNames)
        {
            var response = new GetAllInOUAccountByDisplayNamesResult();
            var dataRequest = new { displayNames = displayNames };
            string xmlDataResult = string.Empty;

            try
            {
                _share.LogInformation($"STEP1: Service GetAllInOUAccountByDisplayNames");

                string httpContent = string.Format("displayNames={0}", displayNames);
                string url = string.Format("{0}/{1}", AppConfig.BotAdBaseUrl, AppConfig.BotADGetAllInOUAccountByDisplayNames);

                if (AppConfig.IsMockFlag == "N")
                {
                    xmlDataResult = NetworkHelper.requestHttpWebService(url, "POST", httpContent);
                }
                else
                {
                    xmlDataResult = MockDataHelper.GetAllInOUAccountByDisplayNamesMock();

                }

                _share.LogInformation($"STEP2: Call XML Data From Service");

                if (xmlDataResult == null ||
                    xmlDataResult.Trim() == string.Empty ||
                    xmlDataResult.Trim() == XmlHelper.XmlTextDeclaration())
                {
                    response.data = null;
                    response.SetResponseDataNotFound("ไม่พบข้อมูล XML");
                    return await Task.FromResult(response);
                }

                _share.LogInformation($"STEP3: Load XML Data");
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(xmlDataResult);
                XmlNodeList xmlUserLists = xmlDoc.GetElementsByTagName("Object");
                bool isHasData = (xmlDoc.InnerText != null && xmlDoc.InnerText != string.Empty) ? true : false;

                if (isHasData)
                {
                    _share.LogInformation($"STEP4: isHasData");

                    var adUsers = await LoadXmlInternalAllInOUAccountData(xmlUserLists);
                    if (adUsers == null)
                    {
                        _share.LogInformation($"STEP5: User Not Found.");
                        response.data = null;
                        response.SetResponseDataNotFound("ไม่พบข้อมูล");
                        return await Task.FromResult(response);
                    }

                    var activeUsers = adUsers.Where(u => u.Status == "1").ToList();
                    if (activeUsers == null)
                    {
                        _share.LogInformation($"STEP5: User Not Found or Inactive.");
                        response.data = null;
                        response.SetResponseDataNotFound("ไม่พบข้อมูล");
                        return await Task.FromResult(response);

                    }

                    _share.LogInformation($"STEP5: Set User Result Data to Response.");
                    response.SetResponseSuccess();
                    response.data = activeUsers;

                }
                else
                {
                    _share.LogInformation($"STEP4: Xml Doc InnerText Is Empty");
                    response.data = null;
                    response.SetResponseDataNotFound("ไม่พบข้อมูล XML");
                }

                return await Task.FromResult(response);
            }
            catch (Exception ex)
            {
                response.SetResponseInternalServiceError(ex.GetErrorMessage());
            }

            return await Task.FromResult(response);
        }

        private async Task<List<ActiveDirectoryUserData>> LoadXmlInternalUserData(XmlNodeList xmlUserLists)
        {
            List<ActiveDirectoryUserData> adUsers = new List<ActiveDirectoryUserData>();

            #region / Mapping Xml to Object /

            foreach (XmlNode xmlNode in xmlUserLists)
            {
                List<MemberOfCollectionData> listMemberOf = new List<MemberOfCollectionData>();
                ActiveDirectoryUserData userInfo = new ActiveDirectoryUserData();
                userInfo.DomainName = xmlNode.SelectSingleNode("//DomainName") != null ? xmlNode["DomainName"].InnerText : string.Empty;
                userInfo.ObjectGUID = xmlNode.SelectSingleNode("//ObjectGUID") != null ? xmlNode["ObjectGUID"].InnerText : string.Empty;
                userInfo.Status = xmlNode.SelectSingleNode("//Status") != null ? xmlNode["Status"].InnerText : "0";
                userInfo.AccountType = xmlNode.SelectSingleNode("//AccountType") != null ? xmlNode["AccountType"].InnerText : string.Empty;
                userInfo.ThaiFullName = xmlNode.SelectSingleNode("//ThaiFullName") != null ? xmlNode["ThaiFullName"].InnerText : string.Empty;
                userInfo.EnglishFullName = xmlNode.SelectSingleNode("//EnglishFullName") != null ? xmlNode["EnglishFullName"].InnerText : string.Empty;
                userInfo.ThaiFirstName = xmlNode.SelectSingleNode("//ThaiFirstName") != null ? xmlNode["ThaiFirstName"].InnerText : string.Empty;
                userInfo.ThaiLastName = xmlNode.SelectSingleNode("//ThaiLastName") != null ? xmlNode["ThaiLastName"].InnerText : string.Empty;
                userInfo.EnglishFirstName = xmlNode.SelectSingleNode("//EnglishFirstName") != null ? xmlNode["EnglishFirstName"].InnerText : string.Empty;
                userInfo.EnglishLastName = xmlNode.SelectSingleNode("//EnglishLastName") != null ? xmlNode["EnglishLastName"].InnerText : string.Empty;
                userInfo.Department = xmlNode.SelectSingleNode("//Department") != null ? xmlNode["Department"].InnerText : string.Empty;
                userInfo.Email = xmlNode.SelectSingleNode("//Email") != null ? xmlNode["Email"].InnerText : string.Empty;
                userInfo.LogonName = xmlNode.SelectSingleNode("//LogonName") != null ? xmlNode["LogonName"].InnerText : string.Empty;
                userInfo.ErrorMessage = xmlNode.SelectSingleNode("//ErrorMessage") != null ? xmlNode["ErrorMessage"].InnerText : string.Empty;
                adUsers.Add(userInfo);
            }
            #endregion / Mapping Xml to Object /

            return await Task.FromResult(adUsers);
        }

        private async Task<List<ActiveDirectoryUserData>> LoadXmlInternalAllInOUAccountData(XmlNodeList xmlUserLists)
        {
            List<ActiveDirectoryUserData> adUsers = new List<ActiveDirectoryUserData>();

            #region / Mapping Xml to Object /

            foreach (XmlNode xmlNode in xmlUserLists)
            {
                List<MemberOfCollectionData> listMemberOf = new List<MemberOfCollectionData>();
                ActiveDirectoryUserData userInfo = new ActiveDirectoryUserData();
                userInfo.DomainName = xmlNode.SelectSingleNode("//DomainName") != null ? xmlNode["DomainName"].InnerText : string.Empty;
                userInfo.ObjectGUID = xmlNode.SelectSingleNode("//ObjectGUID") != null ? xmlNode["ObjectGUID"].InnerText : string.Empty;
                userInfo.Status = xmlNode.SelectSingleNode("//Status") != null ? xmlNode["Status"].InnerText : "0";
                userInfo.AccountType = xmlNode.SelectSingleNode("//AccountType") != null ? xmlNode["AccountType"].InnerText : string.Empty;
                userInfo.ThaiFullName = xmlNode.SelectSingleNode("//ThaiFullName") != null ? xmlNode["ThaiFullName"].InnerText : string.Empty;
                userInfo.EnglishFullName = xmlNode.SelectSingleNode("//EnglishFullName") != null ? xmlNode["EnglishFullName"].InnerText : string.Empty;
                userInfo.Email = xmlNode.SelectSingleNode("//Email") != null ? xmlNode["Email"].InnerText : string.Empty;

                if (!string.IsNullOrWhiteSpace(userInfo.Email))
                {
                    userInfo.LogonName = userInfo.Email.Split('@')[0] ?? string.Empty;
                }

                adUsers.Add(userInfo);
            }
            #endregion / Mapping Xml to Object /

            return await Task.FromResult(adUsers);
        }

        #endregion /* BOT AD WS */

        #region /* BOT AUTHEN WS */

        public async Task<GetActivePersonByCertResult> GetActivePersonByCert(string sCertificate)
        {
            var response = new GetActivePersonByCertResult();
            var dataRequest = new { sCertificate = sCertificate };
            string xmlDataResult = string.Empty;
            try
            {

                _share.LogInformation($"STEP1: Executing GetActivePersonByCert Service");

                //string httpContent = string.Format("sCertificate={0}", sCertificate);
                string url = string.Format("{0}/{1}", AppConfig.BotAuthenBaseUrl, AppConfig.BotAuthenGetActivePersonByCert);

                if (AppConfig.IsMockFlag == "N")
                {
                    _share.LogInformation($"STEP2: Call BOT WS GetActivePersonByCert");
                    xmlDataResult = await NetworkHelper.RequestHttpWebServiceGetCertificateAsync(url, sCertificate);
                }
                else
                {
                    _share.LogInformation($"STEP2: GetActivePersonByCertMock Data");
                    xmlDataResult = MockDataHelper.GetActivePersonByCertMock();
                }

                if (string.IsNullOrWhiteSpace(xmlDataResult) || xmlDataResult.Contains("Internal Server Error"))
                {
                    _share.LogInformation($"STEP3: Service GetCertificate Internal Server Error");
                    response.data = null;
                    response.SetResponseDataNotFound("ไม่พบข้อมูล");
                    return await Task.FromResult(response);
                }


                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(xmlDataResult);
                _share.LogInformation($"STEP3: Load Xml Data Result and check Has Data");
                XmlNodeList xmlProfileLists = xmlDoc.GetElementsByTagName("Profile");
                //XmlNodeList xmlProfileLists = xmlDoc.SelectNodes("/string/Profile");
                bool isHasData = (xmlDoc.InnerText != null && xmlDoc.InnerText != string.Empty) ? true : false;

                if (isHasData)
                {
                    _share.LogInformation($"STEP4: Extract Xml Data Result");
                    var xmlRawData = AppConfig.IsMockFlag == "Y" ? xmlDataResult : xmlDoc.InnerText;
                    var profiles = await LoadXmlExternalProfileData(xmlRawData);

                    if (profiles == null)
                    {
                        _share.LogInformation($"STEP5: Set Data and Return Response NotFound");
                        response.data = null;
                        response.SetResponseDataNotFound("ไม่พบข้อมูล");
                        return await Task.FromResult(response);
                    }


                    _share.LogInformation($"STEP5: Set Data and Return Response Success");
                    response.data = profiles.FirstOrDefault();
                    response.SetResponseSuccess();

                }
                else
                {
                    _share.LogInformation($"STEP4: Xml Data Result NotFound");
                    response.data = null;
                    response.SetResponseDataNotFound("ไม่พบข้อมูล XML");
                }

                return await Task.FromResult(response);
            }
            catch (Exception ex)
            {
                response.SetResponseInternalServiceError(ex.GetErrorMessage());
            }

            return await Task.FromResult(response);
        }

        public async Task<GetPersonListBySearchNameResult> GetPersonListBySearchName(string partialName, string organizationID)
        {
            var response = new GetPersonListBySearchNameResult();
            var dataRequest = new { partialThaiDisplayName = partialName, organizationID = organizationID };
            string xmlDataResult = string.Empty;
            try
            {
                _share.LogInformation($"STEP1: Executing GetPersonListBySearchName Service");

                string httpContent = string.Format("partialThaiDisplayName={0}&organizationID={1}", partialName, organizationID);
                string url = string.Format("{0}/{1}", AppConfig.BotAuthenBaseUrl, AppConfig.BotAuthenGetPersonListBySearchName);

                if (AppConfig.IsMockFlag == "N")
                {
                    _share.LogInformation($"STEP2: Call BOT WS GetPersonListBySearchName");
                    xmlDataResult = NetworkHelper.requestHttpWebService(url, "POST", httpContent);
                }
                else
                {
                    _share.LogInformation($"STEP2: GetPersonListBySearchName Data");
                    xmlDataResult = MockDataHelper.GetPersonListBySearchNameMock();

                }

                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(xmlDataResult);
                _share.LogInformation($"STEP3: Load Xml Data Result and check Has Data");
                XmlNodeList xmlProfileLists = xmlDoc.GetElementsByTagName("Profile");
                //XmlNodeList xmlProfileLists = xmlDoc.SelectNodes("/string/Profiles");
                bool isHasData = (xmlDoc.InnerText != null && xmlDoc.InnerText != string.Empty) ? true : false;

                if (isHasData)
                {
                    _share.LogInformation($"STEP4: Extract Xml Data Result");
                    var xmlRawData = AppConfig.IsMockFlag == "Y" ? xmlDataResult : xmlDoc.InnerText;
                    var profiles = await LoadXmlExternalProfileData(xmlRawData);
                    if (profiles == null)
                    {
                        _share.LogInformation($"STEP5: Set Data and Return Response NotFound");
                        response.data = null;
                        response.SetResponseDataNotFound("ไม่พบข้อมูล");
                        return await Task.FromResult(response);
                    }

                    var activeUsers = profiles.Where(u => u.Status == "1").ToList();
                    if (activeUsers == null)
                    {
                        _share.LogInformation($"STEP5: User Status Inactive.");
                        response.data = null;
                        response.SetResponseDataNotFound("ไม่พบข้อมูล");
                        return await Task.FromResult(response);
                    }

                    _share.LogInformation($"STEP5: Set Data and Return Response Success");
                    response.data = activeUsers;
                    response.SetResponseSuccess();
                }
                else
                {
                    _share.LogInformation($"STEP4: Xml Data Result NotFound");
                    response.data = null;
                    response.SetResponseDataNotFound("ไม่พบข้อมูล XML");
                }

                return await Task.FromResult(response);
            }
            catch (Exception ex)
            {
                response.SetResponseInternalServiceError(ex.GetErrorMessage());
            }

            return await Task.FromResult(response);
        }

        private async Task<List<ExternalUserProfileData>> LoadXmlExternalProfileData(string xmlDataResult)
        {

            List<ExternalUserProfileData> externalUsers = new List<ExternalUserProfileData>();

            try
            {
                DataSet ds = XmlHelper.ReadXmlTextDataSet(xmlDataResult);
                DataTable dt = new DataTable();
                if (ds != null && ds.Tables != null && ds.Tables.Count > 0)
                {
                    dt = ds.Tables.Count > 1 ? ds.Tables[1] : ds.Tables[0];

                    foreach (DataRow dr in dt.Rows)
                    {
                        var userInfo = new ExternalUserProfileData();
                        userInfo.RegID = dr["RegID"] != null ? dr["RegID"].ToString() : string.Empty;
                        userInfo.PID = dr["PID"] != null ? dr["PID"].ToString() : string.Empty;
                        userInfo.NameEN = dr["NameEN"] != null ? dr["NameEN"].ToString() : string.Empty;
                        userInfo.NameTH = dr["NameTH"] != null ? dr["NameTH"].ToString() : string.Empty;
                        userInfo.InstCode = dr["InstCode"] != null ? dr["InstCode"].ToString() : string.Empty;
                        userInfo.ProfileType = dr["ProfileType"] != null ? dr["ProfileType"].ToString() : string.Empty;
                        userInfo.Status = dr["Status"] != null ? dr["Status"].ToString() : "0";
                        externalUsers.Add(userInfo);
                    }
                }

                return await Task.FromResult(externalUsers);

            }
            catch
            {
                return new List<ExternalUserProfileData>();
            }
        }

        #endregion /* BOT AUTHEN WS */

    }
}
