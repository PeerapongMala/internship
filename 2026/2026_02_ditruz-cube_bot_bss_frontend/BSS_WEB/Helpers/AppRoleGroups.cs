using System.ComponentModel;

namespace BSS_WEB.Helpers
{
    public enum AppRoleGroups
    {
        [Description("Operator")]
        [Category("RG01")]
        Operator,
        [Description("Supervisor")]
        [Category("RG02")]
        Supervisor,
        [Description("Manager")]
        [Category("RG03")]
        Manager,
        [Description("Administrator")]
        [Category("RG04")]
        Administrator,
        [Description("Administrator (CCC)")]
        [Category("RG05")]
        AdministratorCCC,
        [Description("Technician")]
        [Category("RG06")]
        Technician,
        [Description("Analyst")]
        [Category("RG07")]
        Analyst,
        [Description("Banknote Staff")]
        [Category("RG08")]
        BanknoteStaff
    }
}
