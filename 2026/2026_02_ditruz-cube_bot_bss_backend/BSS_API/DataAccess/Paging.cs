namespace BSS_API.DataAccess
{
    public class Paging
    {
        #region Properties

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = int.MaxValue;
        public string SortBy { get; set; } = string.Empty;
        public string SortDirection { get; set; } = string.Empty;

        private int _StartRecord = 0;
        private int _EndRecord = 0;

        public int StartRecord
        {
            get
            {
                if (PageNumber > 0)
                {
                    _StartRecord = (PageNumber * PageSize) - PageSize;
                }
                return _StartRecord;
            }
        }

        public int EndRecord
        {
            get
            {
                if (PageNumber > 0)
                {
                    _EndRecord = (PageNumber * PageSize);
                }
                return _EndRecord;
            }
        }

        #endregion

        #region Constructor

        public Paging()
        {

        }

        public Paging(int pageNumber, int pageSize)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
        }

        #endregion
    }
}
