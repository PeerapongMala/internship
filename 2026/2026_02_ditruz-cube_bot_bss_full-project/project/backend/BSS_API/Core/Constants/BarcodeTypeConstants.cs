namespace BSS_API.Core.Constants
{
    public abstract class RefCodeLengthConstants
    {
        public const int RefCodeLength = 8;
    }

    public enum GenerateSequenceTypeEnum
    {
        REFERENCE_SEQUENCE = 0x01,
        SEND_UNSORT_SEQUENCE = 0x02
    }

    public abstract class BarcodeTypeConstants
    {
        /// <summary>
        /// barcode ภาชนะ
        /// </summary>
        public const string BarcodeContainer = "BARCODE_CONTAINER";

        /// <summary>
        /// barcode ห่อ
        /// </summary>
        public const string BarcodeWrap = "BARCODE_WRAP";

        /// <summary>
        /// barcode มัด
        /// </summary>
        public const string BarcodeBundle = "BARCODE_BUNDLE";

        /// <summary>
        /// header card
        /// </summary>
        public const string HeaderCard = "HEADER_CARD";
    }

    public abstract class ValidateBarcodeSuccessMessage
    {
        public static readonly string BarcodeContainerIsValid = "barcode ภาชนะถูกต้อง";

        public static readonly string BarcodeWrapIsValid = "barcode ห่อถูกต้อง";

        public static readonly string BarcodeBundleIsValid = "barcode มัดถูกต้อง";

        public static readonly string HeaderCardIsValid = "header card ถูกต้อง";

        public static readonly string PreparingAtOtherMachine = "ตรวจพบการ prepare ที่เครื่อง : {0}";
    }

    public abstract class ValidateBarcodeErrorMessage
    {
        public static readonly string ValidateTypeParameterInvalid = "validate type parameter invalid";

        public static readonly string ValidateTypeParameterNotFound = "barcode parameter type {0} not found";

        public static readonly string BnTypeParameterNotFound = "bn type parameter type {0} not found";

        public static readonly string BarcodeContainerFail = "barcode ภาชนะไม่ถูกต้อง";

        public static readonly string BarcodeContainerNotFound = "ไม่พบภาชนะ {0}";
        
        public static readonly string BarcodeContainerDuplicate = "พบภาชนะ {0} ในระบบ";

        public static readonly string BarcodeContainerEmptyQty = "ไม่มีธนบัตรในภาชนะนี้แล้ว";

        public static readonly string BarcodeWrapEmptyQty = "มีการ scan ซ้ำหลังจาก prepare มัดครบแล้ว";

        public static readonly string BarcodeContainerLengthFail = "Barcode ภาชนะ มากกว่า หรือ น้อยกว่า 7 หลัก";

        public static readonly string BarcodeWrapFail = "barcode ห่อไม่ถูกต้อง";

        public static readonly string BarcodeBundleFail = "barcode มัดไม่ถูกต้อง";

        public static readonly string BarcodeBundleValidateWrapFail =
            "ข้อมูลหลัก 1,2,3 และ 7,8 ต้องตรงกับ Barcode รายห่อ";

        public static readonly string BarcodeBundleDuplicate = "ต้องไม่มีมัดซ้ำในห่อธนบัตรเดียวกัน";

        public static readonly string HeaderCardFail = "header card ไม่ถูกต้อง";

        public static readonly string HeaderCardIsDuplicate = "พบ header card ในระบบ";

        public static readonly string ValidateCompanyInstitutionInvalid = "ไม่พบธนาคารนี้ {0} ในฐานข้อมูลของระบบ กรุณาติดต่อผู้ดูแลระบบ";
        public static readonly string ValidateCashCenterInvalid = "ไม่พบศูนย์เงินสด {0} ในฐานข้อมูลของระบบ กรุณาติดต่อผู้ดูแลระบบ";
        public static readonly string HeaderCardIsAllRemainingZero = "ไม่มีมัดในภาชนะนี้แล้ว";
        public static readonly string HeaderCardIsRemainingZero = "ไม่มีมัดในธนบัตรนี้แล้ว";
    }
}