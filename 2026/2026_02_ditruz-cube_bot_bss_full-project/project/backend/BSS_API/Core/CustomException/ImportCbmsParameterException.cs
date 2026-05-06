namespace BSS_API.Core.CustomException
{
    public class ImportCbmsParameterException : Exception
    {
        public ImportCbmsParameterException()
        {
        }

        public ImportCbmsParameterException(string message)
            : base(message)
        {
        }

        public ImportCbmsParameterException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}