namespace BSS_API.Core.CustomException
{
    public class BundleInvalidExceltion : Exception
    {
        public BundleInvalidExceltion()
        {
        }

        public BundleInvalidExceltion(string message)
            : base(message)
        {
        }

        public BundleInvalidExceltion(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}