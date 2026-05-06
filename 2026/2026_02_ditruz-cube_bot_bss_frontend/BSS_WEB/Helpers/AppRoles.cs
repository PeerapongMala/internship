using System.ComponentModel;

namespace BSS_WEB.Helpers
{
    public enum AppRoles
    {
        [Description("Operator-Prepare")]
        [Category("ROL01")]
        OperatorPrepare,
        [Description("Operator-Reconcile")]
        [Category("ROL02")]
        OperatorReconcile,
        [Description("Supervisor")]
        [Category("ROL03")]
        Supervisor,
        [Description("Manager")]
        [Category("ROL04")]
        Manager,
        [Description("Administrator")]
        [Category("ROL05")]
        Administrator,
        [Description("Administrator CCC")]
        [Category("ROL06")]
        AdministratorCCC,
        [Description("Technician")]
        [Category("ROL07")]
        Technician,
        [Description("Analyst")]
        [Category("ROL08")]
        Analyst,
        [Description("Banknote Staff")]
        [Category("ROL09")]
        BanknoteStaff
    }
}
