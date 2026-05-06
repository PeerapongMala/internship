namespace BSS_API.Core.Constants
{
    public abstract class EntityNameConstants
    {
        /// <summary>
        /// โซน
        /// </summary>
        public const string MasterZone = "MasterZone";
        public const string MasterUser = "MasterUser";
        public const string MasterConfig = "MasterConfig";
        
        public const string MasterMachine = "MasterMachine";
        
        /// <summary>
        /// สาขา
        /// </summary>
        public const string MasterCashPoint = "MasterCashPoint";
        
        /// <summary>
        /// ข้อมูลสาขา ที่ได้จาก zone
        /// </summary>
        public const string MasterCashPointWithZone = "MasterCashPointWithZone";
        
        public const string MasterUserSuperVisor = "MasterUserSuperVisor";
        
        
        public const string MasterUserPreparator = "MasterUserPreparator";
        
        /// <summary>
        /// ศูนย์เงินสด
        /// </summary>
        public const string MasterCashCenter = "MasterCashCenter";
        
        /// <summary>
        /// ธนาคาร
        /// </summary>
        public const string MasterInstitution = "MasterInstitution";
        
        /// <summary>
        /// ธนาคาร ด้วย company
        /// </summary>
        public const string MasterInstitutionWithCompany = "MasterInstitutionWithCompany";
        
        /// <summary>
        /// ชนิดราคา
        /// </summary>
        public const string MasterDenomination = "MasterDenomination";


        /// <summary>
        /// UnsortCc DDL
        /// </summary>
        public const string MasterCashPointUnsortCc = "MasterCashPointUnsortCc";
        public const string MasterZoneUnsortCc = "MasterZoneUnsortCc";
        public const string MasterDenoUnsortCc = "MasterDenoUnsortCc";
    }
}