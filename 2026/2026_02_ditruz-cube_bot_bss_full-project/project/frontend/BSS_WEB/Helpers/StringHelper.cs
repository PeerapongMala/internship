namespace BSS_WEB.Helpers
{
    public class StringHelper
    {
        #region String Helper

        public static string TrimString(string value)
        {
            try
            {
                string s = string.Empty;
                if (value != null)
                {
                    s = value.Trim();
                }
                return s;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static string NullToString(string value)
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
            catch (Exception ex)
            {
                throw;
            }
        }

        public static string SqlReservedString(string value)
        {
            try
            {
                string s = string.Empty;
                if (value != null)
                {
                    s = value.Trim();
                    s = s.Replace("'", "''");
                }
                return s;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static string EllipsisString(string value, int length)
        {
            try
            {
                string s = string.Empty;
                s = TrimString(value);

                if (s.Length - length > 0)
                {
                    s = string.Format("{0}...", s.Substring(0, length));
                }

                return s;
            }
            catch (Exception ex)
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

                string s = new string(arrChar);

                return s;
            }
            catch (Exception ex)
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
            catch (Exception ex)
            {
                throw;
            }
        }

        #endregion
    }
}
