namespace BSS_API.Core.CustomException
{
    public class DeliveryCodeDuplicateException : Exception
    {
        public DeliveryCodeDuplicateException()
        {
        }

        public DeliveryCodeDuplicateException(string message)
            : base(message)
        {
        }

        public DeliveryCodeDuplicateException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}