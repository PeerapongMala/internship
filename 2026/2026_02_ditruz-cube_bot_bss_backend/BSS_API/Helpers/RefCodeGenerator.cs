namespace BSS_API.Helpers
{
    using System.Security.Cryptography;

    public abstract class RefCodeGenerator
    {
        private static readonly string _chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        public static string GenerateRefCode(int refCodeLength = 8)
        {
            var bytes = new byte[refCodeLength];
            RandomNumberGenerator.Fill(bytes);

            var result = string.Empty;
            foreach (var b in bytes)
            {
                result += _chars[b % _chars.Length];
            }

            return result;
        }
    }
}