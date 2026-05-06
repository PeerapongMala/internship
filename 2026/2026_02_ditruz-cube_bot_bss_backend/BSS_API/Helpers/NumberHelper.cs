namespace BSS_API.Helpers
{
    public class NumberHelper
    {
        #region Number Helper

        public static string To2Digits(int value)
        {
            return value < 1000
                ? value.ToString("D2")
                : value.ToString();
        }

        public static string To3Digits(int value)
        {
            return value < 1000
                ? value.ToString("D3")
                : value.ToString();
        }

        public static string To4Digits(int value)
        {
            return value < 1000
                ? value.ToString("D4")
                : value.ToString();
        }

        public static int StringToInteger(string value)
        {
            try
            {
                int i = 0;
                if (value != null)
                {
                    value = value.Trim();
                    int.TryParse(value, out i);
                }

                return i;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static long StringToLong(string value)
        {
            try
            {
                long l = 0;
                if (value != null)
                {
                    value = value.Trim();
                    long.TryParse(value, out l);
                }

                return l;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static double StringToDouble(string value)
        {
            try
            {
                double d = 0.00;
                if (value != null)
                {
                    value = value.Trim();
                    double.TryParse(value, out d);
                }

                return d;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static bool StringIsInteger(string value)
        {
            try
            {
                int i = 0;
                bool b = b = int.TryParse(value, out i);

                return b;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static bool StringIsLong(string value)
        {
            try
            {
                long l = 0;
                bool b = b = long.TryParse(value, out l);

                return b;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static bool StringIsDouble(string value)
        {
            try
            {
                double d = 0;
                bool b = b = double.TryParse(value, out d);

                return b;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static string IntegerToStringFormat(int value, int precision)
        {
            try
            {
                string s = string.Empty;
                switch (precision)
                {
                    case 0: s = value.ToString("#,##0"); break;
                    case 1: s = value.ToString("#,##0.0"); break;
                    case 2: s = value.ToString("#,##0.00"); break;
                    case 3: s = value.ToString("#,##0.000"); break;
                    case 4: s = value.ToString("#,##0.0000"); break;
                    case 5: s = value.ToString("#,##0.00000"); break;
                    case 6: s = value.ToString("#,##0.000000"); break;
                    default: s = value.ToString("#,##0"); break;
                }

                return s;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static string LongToStringFormat(long value, int precision)
        {
            try
            {
                string s = string.Empty;
                switch (precision)
                {
                    case 0: s = value.ToString("#,##0"); break;
                    case 1: s = value.ToString("#,##0.0"); break;
                    case 2: s = value.ToString("#,##0.00"); break;
                    case 3: s = value.ToString("#,##0.000"); break;
                    case 4: s = value.ToString("#,##0.0000"); break;
                    case 5: s = value.ToString("#,##0.00000"); break;
                    case 6: s = value.ToString("#,##0.000000"); break;
                    default: s = value.ToString("#,##0"); break;
                }

                return s;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static string DoubleToStringFormat(double value, int precision)
        {
            try
            {
                string s = string.Empty;
                switch (precision)
                {
                    case 0: s = value.ToString("#,##0"); break;
                    case 1: s = value.ToString("#,##0.0"); break;
                    case 2: s = value.ToString("#,##0.00"); break;
                    case 3: s = value.ToString("#,##0.000"); break;
                    case 4: s = value.ToString("#,##0.0000"); break;
                    case 5: s = value.ToString("#,##0.00000"); break;
                    case 6: s = value.ToString("#,##0.000000"); break;
                    default: s = value.ToString("#,##0.00"); break;
                }

                return s;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        #endregion
    }
}