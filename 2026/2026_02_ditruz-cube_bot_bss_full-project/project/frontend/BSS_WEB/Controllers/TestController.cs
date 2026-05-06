using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography.X509Certificates;

namespace BSS_WEB.Controllers
{
    [AllowAnonymous]
    public class TestController : Controller
    {
        private readonly ILogger<TestController> _logger;

        public TestController(ILogger<TestController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult GetCurrentUser()
        {
            var user = HttpContext.User.Identity?.Name ?? string.Empty;
            var authType = HttpContext.User.Identity?.AuthenticationType ?? string.Empty;
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();

            _logger.LogInformation($"Login User={user} Auth={authType} IP={ip}");

            return Ok(new
            {
                User = user,
                AuthType = authType,
                Ip = ip
            });
        }

        [HttpGet]
        public IActionResult GetClientCertificate()
        {
            //Read Client Certificate
            X509Certificate2? cert = HttpContext.Connection.ClientCertificate;


            if (cert == null)
            {
                _logger.LogInformation("No Client Certificate");
                return Ok(new
                {
                    Message = "No Client certificate"
                });
            }

            //Validate Cert
            //bool valid = cert.Verify();

            string certSubject = cert.Subject ?? "";
            string certIssuer = cert.Issuer ?? "";
            string certSerialNumber = cert.SerialNumber ?? "";
            string certThumbprint = cert.Thumbprint ?? "";
            string certExpire = cert.NotAfter.ToString() ?? "";

            _logger.LogInformation("Client Cert Subject: " + certSubject);
            _logger.LogInformation("Client Cert Issuer: " + certIssuer);
            _logger.LogInformation("Client Cert SerialNumber: " + certSerialNumber);
            _logger.LogInformation("Client Cert Thumbprint: " + certThumbprint);
            _logger.LogInformation("Client Cert Expire: " + certExpire);

            var certBase64 = Convert.ToBase64String(cert.Export(X509ContentType.Cert));

            _logger.LogInformation("Client Cert Base64: " + certBase64);

            return Ok(new
            {
                CertSubject = certSubject,
                CertIssuer = certIssuer,
                CertSerialNumber = certSerialNumber,
                CertThumbprint = certThumbprint,
                CertExpire = certExpire,
                CertBase = certBase64
            });
        }
    }
}
