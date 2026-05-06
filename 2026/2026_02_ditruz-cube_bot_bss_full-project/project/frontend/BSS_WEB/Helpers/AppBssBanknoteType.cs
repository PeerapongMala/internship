using System.ComponentModel;

namespace BSS_WEB.Helpers
{
    public enum AppBssBanknoteType
    {
        [Description("Unfit")]
        [Category("UF")]
        Unfit,
        [Description("Unsort CA Member")]
        [Category("CA")]
        UnsortCAMember,
        [Description("Unsort CA Non Member")]
        [Category("CN")]
        UnsortCANonMember,
        [Description("Unsort CC")]
        [Category("UC")]
        UnsortCC
    }
}
