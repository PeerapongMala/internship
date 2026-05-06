namespace BSS_API.Models.ModelHelper
{
    using Entities;
    using Core.Constants;
    using SearchParameter;

    public static class MasterConfigHelper
    {
        public static ICollection<DropDownItemResponse<MasterConfig>> ToDropDownItem(
            this ICollection<MasterConfig> masterConfigs, bool includeRowData = false)
        {
            ICollection<DropDownItemResponse<MasterConfig>> itemResponse =
                new List<DropDownItemResponse<MasterConfig>>();
            foreach (var masterConfig in masterConfigs)
            {
                itemResponse.Add(new DropDownItemResponse<MasterConfig>
                {
                    Key = masterConfig.ConfigId,
                    Text = masterConfig.ConfigDesc,
                    Value = masterConfig.ConfigId,
                    RowData = includeRowData ? masterConfig : null
                });
            }

            return itemResponse;
        }

        public static DateTime ToBssWorkDayStartDateTime(this ICollection<MasterConfig> masterConfigs, int? day = null)
        {
            DateTime startDate = day is < 0
                ? DateTime.Today.AddDays(day.Value)
                : DateTime.Today.AddDays(-int.Parse(masterConfigs
                    .First(w => w.ConfigCode == ConfigConstants.BSS_DAY)
                    .ConfigValue ?? "1"));
            return startDate.Add(TimeSpan.Parse(masterConfigs
                .First(w => w.ConfigCode == ConfigConstants.BSS_START_TIME).ConfigValue ?? "08:00:00"));
        }

        public static DateTime ToBssWorkDayEndDateTime(this ICollection<MasterConfig> masterConfigs, int? day = null)
        {
            DateTime endDate = day is > 0
                ? DateTime.Today.AddDays(day.Value)
                : DateTime.Today.AddDays(int.Parse(masterConfigs
                    .First(w => w.ConfigCode == ConfigConstants.BSS_DAY)
                    .ConfigValue ?? "1"));
            return endDate.Add(TimeSpan.Parse(masterConfigs
                .First(w => w.ConfigCode == ConfigConstants.BSS_START_TIME).ConfigValue ?? "08:00:00"));
        }

        public static DateTime ToScanPrepareBssWorkDayStartDateTime(this ICollection<MasterConfig> masterConfigs,
            int? day = null)
        {
            MasterConfig? bssDayConfig =
                masterConfigs.FirstOrDefault(w => w.ConfigCode == ConfigConstants.BSS_WORK_DAY);
            if (bssDayConfig is { UpdatedDate: not null })
            {
                int daysDiff = (DateTime.Now.Date - bssDayConfig.UpdatedDate.Value.Date).Days;
                if (daysDiff > 1 && daysDiff <= Convert.ToInt32(bssDayConfig.ConfigValue))
                {
                    DateTime startDate =
                        day is < 0 ? DateTime.Today.AddDays(day.Value) : DateTime.Today.AddDays(-daysDiff);
                    return startDate.Add(TimeSpan.Parse(masterConfigs
                        .First(w => w.ConfigCode == ConfigConstants.BSS_WORK_START_TIME).ConfigValue ?? "08:00:00"));
                }
            }

            DateTime defaultStartDate = DateTime.Now.Date;
            return defaultStartDate.Add(TimeSpan.Parse(masterConfigs
                .First(w => w.ConfigCode == ConfigConstants.BSS_WORK_START_TIME).ConfigValue ?? "08:00:00"));
        }

        public static DateTime ToScanPrepareBssWorkDayEndDateTime(this ICollection<MasterConfig> masterConfigs,
            int? day = null)
        {
            MasterConfig? bssDayConfig =
                masterConfigs.FirstOrDefault(w => w.ConfigCode == ConfigConstants.BSS_WORK_DAY);
            if (bssDayConfig is { UpdatedDate: not null })
            {
                int daysDiff = (DateTime.Now.Date - bssDayConfig.UpdatedDate.Value.Date).Days;
                if (daysDiff > 1 && daysDiff <= Convert.ToInt32(bssDayConfig.ConfigValue))
                {
                    DateTime startDate =
                        day is > 0 ? DateTime.Today.AddDays(day.Value) : DateTime.Today.AddDays(daysDiff);
                    return startDate.Add(TimeSpan.Parse(masterConfigs
                        .First(w => w.ConfigCode == ConfigConstants.BSS_WORK_START_TIME).ConfigValue ?? "08:00:00"));
                }
            }

            var defaultDay = Convert.ToInt32(bssDayConfig != null ? bssDayConfig.ConfigValue : 1);
            DateTime defaultEndDate = DateTime.Now.Date.AddDays(defaultDay);
            return defaultEndDate.Add(TimeSpan.Parse(masterConfigs
                .First(w => w.ConfigCode == ConfigConstants.BSS_WORK_START_TIME).ConfigValue ?? "08:00:00"));
        }

        //

        public static DateTime ToValidateHeaderCardStartDateTime(this ICollection<MasterConfig> masterConfigs,
         int? day = null)
        {
            MasterConfig? bssDayConfig =
                masterConfigs.FirstOrDefault(w => w.ConfigCode == ConfigConstants.BSS_CHECK_DUP_HC);

            var defaultDay = Convert.ToInt32(bssDayConfig != null ? bssDayConfig.ConfigValue : 2);
            DateTime startDate = day is < 0 ? DateTime.Today.AddDays(day.Value) : DateTime.Today.AddDays(-defaultDay);
            return startDate;
        }


        public static DateTime ToValidateHeaderCardEndDateTime(this ICollection<MasterConfig> masterConfigs,
             int? day = null)
        {
            //MasterConfig? bssDayConfig =
            //    masterConfigs.FirstOrDefault(w => w.ConfigCode == ConfigConstants.BSS_CHECK_DUP_HC);

            DateTime defaultEndDate = DateTime.Now;
            return defaultEndDate;
        }


    }
}