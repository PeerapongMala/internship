using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace BSS_WEB.Helpers
{
    public static class PemHelper
    {
        public static string ExportCertPem(X509Certificate2 cert)
        {
            var base64 = Convert.ToBase64String(cert.Export(X509ContentType.Cert));

            return WrapPem(base64, "CERTIFICATE");
        }

        public static string? ExportPrivateKeyPem(X509Certificate2 cert)
        {
            using RSA? rsa = cert.GetRSAPrivateKey();
            if (rsa == null) return null;

            var keyBytes = rsa.ExportPkcs8PrivateKey();
            var base64 = Convert.ToBase64String(keyBytes);

            return WrapPem(base64, "PRIVATE KEY");
        }

        private static string WrapPem(string base64, string label)
        {
            var sb = new StringBuilder();
            sb.AppendLine($"-----BEGIN {label}-----");

            for (int i = 0; i < base64.Length; i += 64)
                sb.AppendLine(base64.Substring(i, Math.Min(64, base64.Length - i)));

            sb.AppendLine($"-----END {label}-----");

            return sb.ToString();
        }

    }
}
