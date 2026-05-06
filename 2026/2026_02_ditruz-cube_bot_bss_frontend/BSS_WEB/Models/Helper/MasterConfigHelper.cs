namespace BSS_WEB.Models.Helper
{
    using BSS_WEB.Core.Constants;
    using BSS_WEB.Models.DisplayModel;

    public static class MasterConfigHelper
    {
        public static DateTime ToBssWorkDayStartDateTime(this ICollection<MasterConfigDisplay> masterConfigs, int? day = null)
        {
            DateTime startDate = day is < 0
               ? DateTime.Today.AddDays(day.Value)
               : DateTime.Today.AddDays(-int.Parse(masterConfigs
                   .First(w => w.configCode == ConfigConstants.BSS_DAY)
                   .configValue ?? "1"));
            return startDate.Add(TimeSpan.Parse(masterConfigs
                .First(w => w.configCode == ConfigConstants.BSS_START_TIME).configValue ?? "08:00:00"));
        }

        public static DateTime ToBssWorkDayEndDateTime(this ICollection<MasterConfigDisplay> masterConfigs, int? day = null)
        {
            DateTime endDate = day is > 0
                ? DateTime.Today.AddDays(day.Value)
                : DateTime.Today.AddDays(int.Parse(masterConfigs
                    .First(w => w.configCode == ConfigConstants.BSS_DAY)
                    .configValue ?? "1"));
            return endDate.Add(TimeSpan.Parse(masterConfigs
                .First(w => w.configCode == ConfigConstants.BSS_START_TIME).configValue ?? "08:00:00"));
        }

        public static DateTime ToScanPrepareBssWorkDayStartDateTime(this ICollection<MasterConfigDisplay> masterConfigs, int? day = null)
        {
            MasterConfigDisplay? bssDayConfig = masterConfigs.FirstOrDefault(w => w.configCode == ConfigConstants.BSS_FORNT_WORK_DAY);
            if (bssDayConfig is { updatedDate: not null })
            {
                int daysDiff = (DateTime.Now.Date - bssDayConfig.updatedDate.Value.Date).Days;
                if (daysDiff > 1 && daysDiff <= Convert.ToInt32(bssDayConfig.configValue))
                {
                    DateTime startDate = day is < 0 ? DateTime.Today.AddDays(day.Value) : DateTime.Today.AddDays(-daysDiff);
                    return startDate.Add(TimeSpan.Parse(masterConfigs
                        .First(w => w.configCode == ConfigConstants.BSS_FORNT_START_TIME).configValue ?? "08:00:00"));
                }
            }

            DateTime defaultStartDate = DateTime.Now.Date;
            return defaultStartDate.Add(TimeSpan.Parse(masterConfigs
                .First(w => w.configCode == ConfigConstants.BSS_FORNT_START_TIME).configValue ?? "08:00:00"));
        }

        public static DateTime ToScanPrepareBssWorkDayEndDateTime(this ICollection<MasterConfigDisplay> masterConfigs, int? day = null)
        {
            MasterConfigDisplay? bssDayConfig = masterConfigs.FirstOrDefault(w => w.configCode == ConfigConstants.BSS_FORNT_WORK_DAY);
            if (bssDayConfig is { updatedDate: not null })
            {
                int daysDiff = (DateTime.Now.Date - bssDayConfig.updatedDate.Value.Date).Days;
                if (daysDiff > 1 && daysDiff <= Convert.ToInt32(bssDayConfig.configValue))
                {
                    DateTime startDate = day is > 0 ? DateTime.Today.AddDays(day.Value) : DateTime.Today.AddDays(daysDiff);
                    return startDate.Add(TimeSpan.Parse(masterConfigs
                        .First(w => w.configCode == ConfigConstants.BSS_FORNT_START_TIME).configValue ?? "08:00:00"));
                }
            }

            var defaultDay = Convert.ToInt32(bssDayConfig != null ? bssDayConfig.configValue : 1);
            DateTime defaultEndDate = DateTime.Now.Date.AddDays(defaultDay);
            return defaultEndDate.Add(TimeSpan.Parse(masterConfigs
                .First(w => w.configCode == ConfigConstants.BSS_FORNT_START_TIME).configValue ?? "08:00:00"));
        }

        public static DateTime ToViewPrepareBssWorkDayStartDateTime(this ICollection<MasterConfigDisplay> masterConfigs, int? day = null)
        {
            DateTime startDate = day is < 0
               ? DateTime.Today.AddDays(day.Value)
               : DateTime.Today.AddDays(-int.Parse(masterConfigs
                   .First(w => w.configCode == ConfigConstants.BSS_FORNT_WORK_DAY)
                   .configValue ?? "1"));
            return startDate.Add(TimeSpan.Parse(masterConfigs
                .First(w => w.configCode == ConfigConstants.BSS_FORNT_START_TIME).configValue ?? "16:30:00"));
        }

        public static DateTime ToViewPrepareBssWorkDayEndDateTime(this ICollection<MasterConfigDisplay> masterConfigs, int? day = null)
        {
            //DateTime endDate = day is > 0
            //    ? DateTime.Today.AddDays(day.Value)
            //    : DateTime.Today.AddDays(int.Parse(masterConfigs
            //        .First(w => w.configCode == ConfigConstants.BSS_FORNT_WORK_DAY)
            //        .configValue ?? "1"));

            DateTime endDate = day is > 0 ? DateTime.Today.AddDays(day.Value) : DateTime.Today;

            return endDate.Add(TimeSpan.Parse(masterConfigs
                .First(w => w.configCode == ConfigConstants.BSS_FORNT_START_TIME).configValue ?? "16:30:00"));
        }


    }
}
