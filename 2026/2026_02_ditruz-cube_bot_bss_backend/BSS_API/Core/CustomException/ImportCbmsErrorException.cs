namespace BSS_API.Core.CustomException
{
    public class ImportCbmsErrorException : Exception
    {
        public ImportCbmsErrorException()
        {
        }

        public ImportCbmsErrorException(string message)
            : base(message)
        {
        }

        public ImportCbmsErrorException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}