namespace BSS_API.Core.Template
{
    using MimeKit;
    using MailKit.Net.Smtp;
    using MailKit.Security;
    using System.Security.Cryptography;

    public abstract class SystemMailTemplate
    {
        private SmtpClient _smtpClient;

        protected void SetSmtpClient(SmtpClient? smtpClient)
        {
            _smtpClient = smtpClient ?? throw new ArgumentNullException(nameof(smtpClient));
        }

        protected async Task<bool> CanConnectAsync(string smtpServer, int port, string username, string password,
            bool useSsl = true)
        {
            try
            {

                // Note: Fixed For BOT  ????????? 
                await _smtpClient.ConnectAsync(
                    smtpServer,
                    port
                );


                //await _smtpClient.ConnectAsync(
                //    smtpServer,
                //    port,
                //    useSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None
                //);

                //await _smtpClient.AuthenticateAsync(
                //    username,
                //    password
                //);

                return _smtpClient.IsConnected;
            }
            catch (Exception)
            {
                return false;
            }
        }

        protected async Task SendMailAsync(MimeMessage message)
        {
            try
            {
                await _smtpClient.SendAsync(message);
            }
            finally
            {
                await _smtpClient.DisconnectAsync(true);
            }
        }

        protected string GenerateOtp(int otpLength = 6)
        {
            var bytes = new byte[otpLength];
            RandomNumberGenerator.Fill(bytes);

            var otp = string.Empty;
            foreach (var b in bytes)
            {
                otp += (b % 10).ToString();
            }

            return otp;
        }
    }
}