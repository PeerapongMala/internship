using System.ComponentModel;

namespace BSS_WEB.Helpers
{
    public enum AppCashType
    {
        [Description("Fit")]
        [Category("1")]
        Fit,
        [Description("Unfit")]
        [Category("2")]
        Unfit,
        [Description("Good")]
        [Category("3")]
        Good,
        [Description("Unsort")]
        [Category("4")]
        Unsort
    }
}
