namespace BSS_API.Helpers
{
    
    using System.Globalization;
    
    public class DateTimeHelper
    {
        #region Global Variable

        public static string[] MonthThaiLongName = { "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม" };
        public static string[] MonthThaiShortName = { "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค." };

        public static string[] MonthEnglishLongName = { "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" };
        public static string[] MonthEnglishShortName = { "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" };

        #endregion

        #region DateTime Helper

        public static string DateTimeToString(DateTime value, string culture, int format)
        {
            try
            {
                culture = StringHelper.TrimString(culture);
                culture = culture.ToUpper();
                CultureInfo cultureInfo = new CultureInfo(culture);

                string date = string.Empty;

                switch (format)
                {
                    case 100:
                        date = value.ToString("dd/MM/yyyy", cultureInfo);
                        break;
                    case 101:
                        date = value.ToString("dd-MM-yyyy", cultureInfo);
                        break;
                    case 102:
                        date = value.ToString("dd-MMM-yyyy", cultureInfo);
                        break;
                    case 103:
                        date = value.ToString("dd-MMMM-yyyy", cultureInfo);
                        break;
                    case 104:
                        date = value.ToString("dd-MM-yyyy HH:mm:ss", cultureInfo);
                        break;
                    case 105:
                        date = value.ToString("dd-MM-yyyy HH:mm:ss:fff", cultureInfo);
                        break;
                    case 106:
                        date = value.ToString("MM/yyyy", cultureInfo);
                        break;
                    case 107:
                        date = value.ToString("MM-yyyy", cultureInfo);
                        break;
                    case 108:
                        date = value.ToString("MMM-yyyy", cultureInfo);
                        break;
                    case 109:
                        date = value.ToString("MMM yyyy", cultureInfo);
                        break;
                    case 110:
                        date = value.ToString("MMMM-yyyy", cultureInfo);
                        break;
                    case 111:
                        date = value.ToString("MMMM yyyy", cultureInfo);
                        break;
                    case 112:
                        date = value.ToString("yyyy/MM/dd", cultureInfo);
                        break;
                    case 113:
                        date = value.ToString("yyyy-MM-dd", cultureInfo);
                        break;
                    case 114:
                        date = value.ToString("yyyy-MM-dd HH:mm:ss", cultureInfo);
                        break;
                    case 115:
                        date = value.ToString("yyyy-MM-dd HH:mm:ss:fff", cultureInfo);
                        break;
                    case 116:
                        date = value.ToString("yyyyMMdd", cultureInfo);
                        break;
                    case 117:
                        date = value.ToString("yyyyMMddHHmmss", cultureInfo);
                        break;
                    case 118:
                        date = value.ToString("yyyyMMddHHmmssfff", cultureInfo);
                        break;
                    case 119:
                        date = value.ToString("yyyy/MM", cultureInfo);
                        break;
                    case 120:
                        date = value.ToString("yyyy-MM", cultureInfo);
                        break;
                    case 121:
                        date = value.ToString("yyyyMM", cultureInfo);
                        break;
                    case 122:
                        date = value.ToString("yyyy", cultureInfo);
                        break;
                    case 123:
                        date = value.ToString("HH:mm:ss", cultureInfo);
                        break;
                    case 124:
                        date = value.ToString("HHmmss", cultureInfo);
                        break;
                    case 125:
                        date = string.Format("{0}T{1}", value.ToString("yyyy-MM-dd", cultureInfo), value.ToString("HH:mm:ss.fff", cultureInfo));
                        break;
                    default:
                        date = value.ToString("dd/MM/yyyy HH:mm:ss", cultureInfo);
                        break;
                }

                return date;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static string DateTimeToString(DateTime value, string culture, string stringFormat)
        {
            try
            {
                culture = StringHelper.TrimString(culture);
                culture = culture.ToUpper();
                CultureInfo cultureInfo = new CultureInfo(culture);

                string date = value.ToString(stringFormat, cultureInfo);

                return date;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static DateTime? StringToDateTime(string value, string culture, int format)
        {
            try
            {
                culture = StringHelper.TrimString(culture);
                culture = culture.ToUpper();
                CultureInfo cultureInfo = new CultureInfo(culture);

                DateTime date = new DateTime();

                switch (format)
                {
                    case 100:
                        date = DateTime.ParseExact(value, "dd/MM/yyyy", cultureInfo);
                        break;
                    case 101:
                        date = DateTime.ParseExact(value, "dd-MM-yyyy", cultureInfo);
                        break;
                    case 102:
                        date = DateTime.ParseExact(value, "dd-MMM-yyyy", cultureInfo);
                        break;
                    case 103:
                        date = DateTime.ParseExact(value, "dd-MMMM-yyyy", cultureInfo);
                        break;
                    case 104:
                        date = DateTime.ParseExact(value, "dd-MM-yyyy HH:mm:ss", cultureInfo);
                        break;
                    case 105:
                        date = DateTime.ParseExact(value, "dd-MM-yyyy HH:mm:ss:fff", cultureInfo);
                        break;
                    case 106:
                        date = DateTime.ParseExact(value, "MM/yyyy", cultureInfo);
                        break;
                    case 107:
                        date = DateTime.ParseExact(value, "MM-yyyy", cultureInfo);
                        break;
                    case 108:
                        date = DateTime.ParseExact(value, "MMM-yyyy", cultureInfo);
                        break;
                    case 109:
                        date = DateTime.ParseExact(value, "MMM yyyy", cultureInfo);
                        break;
                    case 110:
                        date = DateTime.ParseExact(value, "MMMM-yyyy", cultureInfo);
                        break;
                    case 111:
                        date = DateTime.ParseExact(value, "MMMM yyyy", cultureInfo);
                        break;
                    case 112:
                        date = DateTime.ParseExact(value, "yyyy/MM/dd", cultureInfo);
                        break;
                    case 113:
                        date = DateTime.ParseExact(value, "yyyy-MM-dd", cultureInfo);
                        break;
                    case 114:
                        date = DateTime.ParseExact(value, "yyyy-MM-dd HH:mm:ss", cultureInfo);
                        break;
                    case 115:
                        date = DateTime.ParseExact(value, "yyyy-MM-dd HH:mm:ss:fff", cultureInfo);
                        break;
                    case 116:
                        date = DateTime.ParseExact(value, "yyyyMMdd", cultureInfo);
                        break;
                    case 117:
                        date = DateTime.ParseExact(value, "yyyyMMddHHmmss", cultureInfo);
                        break;
                    case 118:
                        date = DateTime.ParseExact(value, "yyyyMMddHHmmssfff", cultureInfo);
                        break;
                    case 119:
                        date = DateTime.ParseExact(value, "yyyy/MM", cultureInfo);
                        break;
                    case 120:
                        date = DateTime.ParseExact(value, "yyyy-MM", cultureInfo);
                        break;
                    case 121:
                        date = DateTime.ParseExact(value, "yyyyMM", cultureInfo);
                        break;
                    case 122:
                        date = DateTime.ParseExact(value, "yyyy", cultureInfo);
                        break;
                    case 123:
                        date = DateTime.ParseExact(value, "HH:mm:ss", cultureInfo);
                        break;
                    case 124:
                        date = DateTime.ParseExact(value, "HHmmss", cultureInfo);
                        break;
                    case 125:
                        date = DateTime.ParseExact(value, "yyyy-MM-ddTHH:mm:ss.fff", cultureInfo);
                        break;
                    default:
                        date = DateTime.ParseExact(value, "dd/MM/yyyy HH:mm:ss", cultureInfo);
                        break;
                }

                return date;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static DateTime? StringToDateTime(string value, string culture, string stringFormat)
        {
            try
            {
                culture = StringHelper.TrimString(culture);
                culture = culture.ToUpper();
                CultureInfo cultureInfo = new CultureInfo(culture);

                DateTime date = DateTime.ParseExact(value, stringFormat, cultureInfo);

                return date;
            }
            catch (Exception)
            {
                return null;
            }
        }

        #endregion


        #region Convert Date Helper

        public static string ToBuddhistDateYYMMDD(DateTime date)
        {
            int year = date.Year;

            int buddhistYear = year >= 2400
                ? year
                : year + 543;

            return $"{buddhistYear % 100:D2}{date:MMdd}";
        }

        #endregion
    }
}
