using DocumentFormat.OpenXml.Spreadsheet;

namespace BSS_WEB.Helpers
{
    public static class MasterShiftHelper
    {
        public static DateTime ToViewPrepareBssFromShiftStartDateTime(TimeSpan? shiftStartTime = null, TimeSpan? shiftEndTime = null)
        {
            var startDateTime = DateTime.Today;
            var endDateTime = DateTime.Today;
            var currenDate = DateTime.Today;

            if (shiftEndTime < shiftStartTime)
            {
                DateTime dateTimeNow = DateTime.Now;

                //เช็คว่าอยู่ในช่วงหลังเที่ยงคืน
                TimeSpan startRange = new TimeSpan(0, 0, 0);   // 00:00
                TimeSpan endRange = new TimeSpan(5, 59, 0);     // 05:59
                bool isAfterMidnight = false;

                if (dateTimeNow.TimeOfDay >= startRange && dateTimeNow.TimeOfDay <= endRange)
                {
                    isAfterMidnight = true;
                }

                if (isAfterMidnight)
                {
                    startDateTime = currenDate.AddDays(-1).Add(shiftStartTime.Value);
                }
                else
                {
                    if (dateTimeNow.TimeOfDay < shiftStartTime.Value)
                    {
                        startDateTime = currenDate.AddDays(-1).Add(shiftStartTime.Value);
                    }
                    else
                    {
                        startDateTime = currenDate.Add(shiftStartTime.Value);
                    }

                }
            }
            else
            {
                startDateTime = currenDate.Add(shiftStartTime.Value);
            }

            return startDateTime;
        }

        public static DateTime ToViewPrepareBssFromShiftEndDateTime(TimeSpan? shiftStartTime = null, TimeSpan? shiftEndTime = null)
        {
            var endDateTime = DateTime.Today;
            var currenDate = DateTime.Today;

            if (shiftEndTime < shiftStartTime)
            {
                DateTime dateTimeNow = DateTime.Now;

                //เช็คว่าอยู่ในช่วงหลังเที่ยงคืน
                TimeSpan startRange = new TimeSpan(0, 0, 0);   // 00:00
                TimeSpan endRange = new TimeSpan(5, 59, 0);     // 05:59
                bool isAfterMidnight = false;

                if (dateTimeNow.TimeOfDay >= startRange && dateTimeNow.TimeOfDay <= endRange)
                {
                    isAfterMidnight = true;
                }

                if (isAfterMidnight)
                {
                    endDateTime = currenDate.Add(shiftEndTime.Value);
                }
                else
                {
                    if (dateTimeNow.TimeOfDay < shiftStartTime.Value)
                    {
                        endDateTime = currenDate.Add(shiftEndTime.Value);
                    }
                    else
                    {
                        endDateTime = currenDate.AddDays(1).Add(shiftEndTime.Value);
                    }
                }
            }
            else
            {
                endDateTime = currenDate.Add(shiftEndTime.Value);
            }

            return endDateTime;
        }
    }
}
