namespace BSS_API.Core.CustomException
{
    public class BarcodeDuplicateException : Exception
    {
        public BarcodeDuplicateException()
        {
        }

        public BarcodeDuplicateException(string message)
            : base(message)
        {
        }

        public BarcodeDuplicateException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}