namespace BSS_API.Helpers
{
    public static class StringHelper
    {
        public static int? GetLast4DigitFromStringAndConvertToInt(string value)
        {
            if (value.Length >= 4 &&
                int.TryParse(value[^4..], out int result))
            {
                return result;
            }

            throw new Exception("invalid get last 4 digit from string");
        }

        public static int? GetLast3DigitFromStringAndConvertToInt(string value)
        {
            if (value.Length >= 3 &&
                int.TryParse(value[^3..], out int result))
            {
                return result;
            }

            throw new Exception("invalid get last 3 digit from string");
        }

        public static string TrimString(string value)
        {
            try
            {
                string result = string.Empty;
                if (!string.IsNullOrEmpty(value))
                {
                    result = value.Trim();
                }

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static string StringNullToString(string? value)
        {
            try
            {
                if (value == null)
                {
                    return string.Empty;
                }
                else
                {
                    return value;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static string SqlReservedString(string value)
        {
            try
            {
                string result = string.Empty;
                if (!string.IsNullOrEmpty(value))
                {
                    result = value.Trim();
                    result = result.Replace("'", "''");
                }

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static string EllipsisString(string value, int length)
        {
            try
            {
                string result = string.Empty;
                result = TrimString(value);

                if (result.Length - length > 0)
                {
                    result = $"{result.Substring(0, length)}...";
                }

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static string CapitalizeString(string value)
        {
            try
            {
                value = TrimString(value);
                char[] arrChar = value.ToCharArray();
                arrChar[0] = Char.ToUpper(arrChar[0]);

                string result = new string(arrChar);
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static string HyphenString(string value)
        {
            try
            {
                value = TrimString(value);
                if (string.IsNullOrEmpty(value))
                {
                    value = "-";
                }

                return value;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}