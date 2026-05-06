using System.ComponentModel;

namespace BSS_WEB.Helpers
{
    public enum AppBnType
    {
        [Description("Unfit")]
        [Category("U")]
        Unfit,
        [Description("Unsort CA Member")]
        [Category("A")]
        UnsortCAMember,
        [Description("Unsort CA Non Member")]
        [Category("A")]
        UnsortCANonMember,
        [Description("Unsort CC")]
        [Category("Z")]
        UnsortCC
    }
}
