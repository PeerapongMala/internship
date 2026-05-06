namespace BSS_WEB.Core.Constants
{
    public enum BNType
    {
        Unfit = 0x01,
        UnsortCAMember = 0x02,
        UnsortCANonMember = 0x03,
        UnsortUnsortCC = 0x04,
    }

    public abstract class BNTypeConstants
    {
        public const int Unfit = 1;
        public const int UnsortCAMember = 2;
        public const int UnsortCANonMember = 3;
        public const int UnsortCC = 4;
    }

    public abstract class BNTypeCodeConstants
    {
        public const string Unfit = "U";
        public const string UnsortCAMember = "A";
        public const string UnsortCANonMember = "A";
        public const string UnsortCC = "Z";
    }

    public abstract class BssBNTypeCodeConstants
    {
        public const string Unfit = "UF";
        public const string UnsortCAMember = "CA";
        public const string UnsortCANonMember = "CN";
        public const string UnsortCC = "UC";
    }
}
