using BSS_API.Helpers;
using Microsoft.Data.SqlClient;
using System.Data;

namespace BSS_API.DataAccess
{
    public class SqlDataAccess
    {
        #region Properties Connection

        public string ConnectionString { get; set; } = string.Empty;
        public int CommandTimeout { get; set; } = 0;

        #endregion Properties Connection

        #region Constructor Connection

        public SqlDataAccess()
        {
        }

        public SqlDataAccess(string connectionString)
        {
            ConnectionString = connectionString;
        }

        public SqlDataAccess(string connectionString, int commandTimeout)
        {
            ConnectionString = connectionString;
            CommandTimeout = commandTimeout;
        }

        #endregion Constructor Connection

        #region Execute Insert, Update, Delete

        public int SaveChange(SqlCommand command)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    command.Connection = connection;
                    command.CommandTimeout = CommandTimeout;

                    int rowsEffect = command.ExecuteNonQuery();

                    return rowsEffect;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public int SaveChange(SqlCommand command, SqlConnection connection)
        {
            try
            {
                command.Connection = connection;
                command.CommandTimeout = CommandTimeout;

                int rowsEffect = command.ExecuteNonQuery();

                return rowsEffect;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public int SaveChange(SqlCommand command, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                command.Connection = connection;
                command.Transaction = transaction;
                command.CommandTimeout = CommandTimeout;

                int rowsEffect = command.ExecuteNonQuery();

                return rowsEffect;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        #endregion Execute Insert, Update, Delete

        #region Execute Select Data

        public List<T> GetDataList<T>(SqlCommand command)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    command.Connection = connection;
                    command.CommandTimeout = CommandTimeout;

                    using (SqlDataAdapter da = new SqlDataAdapter(command))
                    {
                        DataTable dt = new DataTable();
                        da.Fill(dt);

                        List<T> objectList = ModelHelper.CreateObjectList<T>(dt);

                        return objectList;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public List<T> GetDataList<T>(SqlCommand command, SqlConnection connection)
        {
            try
            {
                command.Connection = connection;
                command.CommandTimeout = CommandTimeout;

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    List<T> objectList = ModelHelper.CreateObjectList<T>(dt);

                    return objectList;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public List<T> GetDataList<T>(SqlCommand command, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                command.Connection = connection;
                command.Transaction = transaction;
                command.CommandTimeout = CommandTimeout;

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    List<T> objectList = ModelHelper.CreateObjectList<T>(dt);

                    return objectList;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public T GetDataObject<T>(SqlCommand command)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    command.Connection = connection;
                    command.CommandTimeout = CommandTimeout;

                    using (SqlDataAdapter da = new SqlDataAdapter(command))
                    {
                        DataTable dt = new DataTable();
                        da.Fill(dt);

                        T objectNew = ModelHelper.CreateObject<T>(dt);

                        return objectNew;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public T GetDataObject<T>(SqlCommand command, SqlConnection connection)
        {
            try
            {
                command.Connection = connection;
                command.CommandTimeout = CommandTimeout;

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    T objectNew = ModelHelper.CreateObject<T>(dt);

                    return objectNew;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public T GetDataObject<T>(SqlCommand command, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                command.Connection = connection;
                command.Transaction = transaction;
                command.CommandTimeout = CommandTimeout;

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    T objectNew = ModelHelper.CreateObject<T>(dt);

                    return objectNew;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public DataTable GetDataTable(SqlCommand command)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    command.Connection = connection;
                    command.CommandTimeout = CommandTimeout;

                    using (SqlDataAdapter da = new SqlDataAdapter(command))
                    {
                        DataTable dt = new DataTable();
                        da.Fill(dt);

                        return dt;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public DataTable GetDataTable(SqlCommand command, SqlConnection connection)
        {
            try
            {
                command.Connection = connection;
                command.CommandTimeout = CommandTimeout;

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    return dt;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public DataTable GetDataTable(SqlCommand command, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                command.Connection = connection;
                command.Transaction = transaction;
                command.CommandTimeout = CommandTimeout;

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    return dt;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public DataSet GetDataSet(SqlCommand command)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    command.Connection = connection;
                    command.CommandTimeout = CommandTimeout;

                    using (SqlDataAdapter da = new SqlDataAdapter(command))
                    {
                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public DataSet GetDataSet(SqlCommand command, SqlConnection connection)
        {
            try
            {
                command.Connection = connection;
                command.CommandTimeout = CommandTimeout;

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        #endregion Execute Select Data

        #region Execute Select Data with Paging

        public List<T> GetDataListPaging<T>(SqlCommand command, Paging paging)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    command.Connection = connection;
                    command.CommandTimeout = CommandTimeout;

                    using (SqlDataAdapter da = new SqlDataAdapter(command))
                    {
                        DataSet ds = new DataSet();
                        da.Fill(ds, paging.StartRecord, paging.PageSize, "Paging");

                        DataTable dt = new DataTable();
                        if (ds.Tables.Count > 0)
                        {
                            dt = ds.Tables[0];
                        }

                        dt.Columns.Add("Page");
                        dt.Columns.Add("PageSize");
                        dt.Columns.Add("TotalRow");

                        if (dt.Rows.Count > 0)
                        {
                            DataTable dtTotalRow = new DataTable();
                            da.Fill(dtTotalRow);

                            dt.Rows[0]["Page"] = paging.PageNumber;
                            dt.Rows[0]["PageSize"] = paging.PageSize;
                            dt.Rows[0]["TotalRow"] = dtTotalRow.Rows.Count;
                        }

                        List<T> objectList = ModelHelper.CreateObjectList<T>(dt);

                        return objectList;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public List<T> GetDataListPaging<T>(SqlCommand command, Paging paging, SqlConnection connection)
        {
            try
            {
                command.Connection = connection;
                command.CommandTimeout = CommandTimeout;

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataSet ds = new DataSet();
                    da.Fill(ds, paging.StartRecord, paging.PageSize, "Paging");

                    DataTable dt = new DataTable();
                    if (ds.Tables.Count > 0)
                    {
                        dt = ds.Tables[0];
                    }

                    dt.Columns.Add("Page");
                    dt.Columns.Add("PageSize");
                    dt.Columns.Add("TotalRow");

                    if (dt.Rows.Count > 0)
                    {
                        DataTable dtTotalRow = new DataTable();
                        da.Fill(dtTotalRow);

                        dt.Rows[0]["Page"] = paging.PageNumber;
                        dt.Rows[0]["PageSize"] = paging.PageSize;
                        dt.Rows[0]["TotalRow"] = dtTotalRow.Rows.Count;
                    }

                    List<T> objectList = ModelHelper.CreateObjectList<T>(dt);

                    return objectList;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public List<T> GetDataListPaging<T>(SqlCommand command, Paging paging, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                command.Connection = connection;
                command.Transaction = transaction;
                command.CommandTimeout = CommandTimeout;

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataSet ds = new DataSet();
                    da.Fill(ds, paging.StartRecord, paging.PageSize, "Paging");

                    DataTable dt = new DataTable();
                    if (ds.Tables.Count > 0)
                    {
                        dt = ds.Tables[0];
                    }

                    dt.Columns.Add("Page");
                    dt.Columns.Add("PageSize");
                    dt.Columns.Add("TotalRow");

                    if (dt.Rows.Count > 0)
                    {
                        DataTable dtTotalRow = new DataTable();
                        da.Fill(dtTotalRow);

                        dt.Rows[0]["Page"] = paging.PageNumber;
                        dt.Rows[0]["PageSize"] = paging.PageSize;
                        dt.Rows[0]["TotalRow"] = dtTotalRow.Rows.Count;
                    }

                    List<T> objectList = ModelHelper.CreateObjectList<T>(dt);

                    return objectList;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public DataTable GetDataTablePaging(SqlCommand command, Paging paging)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    command.Connection = connection;
                    command.CommandTimeout = CommandTimeout;

                    using (SqlDataAdapter da = new SqlDataAdapter(command))
                    {
                        DataSet ds = new DataSet();
                        da.Fill(ds, paging.StartRecord, paging.PageSize, "Paging");

                        DataTable dt = new DataTable();
                        if (ds.Tables.Count > 0)
                        {
                            dt = ds.Tables[0];
                        }

                        dt.Columns.Add("Page");
                        dt.Columns.Add("PageSize");
                        dt.Columns.Add("TotalRow");

                        if (dt.Rows.Count > 0)
                        {
                            DataTable dtTotalRow = new DataTable();
                            da.Fill(dtTotalRow);

                            dt.Rows[0]["Page"] = paging.PageNumber;
                            dt.Rows[0]["PageSize"] = paging.PageSize;
                            dt.Rows[0]["TotalRow"] = dtTotalRow.Rows.Count;
                        }

                        return dt;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public DataTable GetDataTablePaging(SqlCommand command, Paging paging, SqlConnection connection)
        {
            try
            {
                command.Connection = connection;
                command.CommandTimeout = CommandTimeout;

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataSet ds = new DataSet();
                    da.Fill(ds, paging.StartRecord, paging.PageSize, "Paging");

                    DataTable dt = new DataTable();
                    if (ds.Tables.Count > 0)
                    {
                        dt = ds.Tables[0];
                    }

                    dt.Columns.Add("Page");
                    dt.Columns.Add("PageSize");
                    dt.Columns.Add("TotalRow");

                    if (dt.Rows.Count > 0)
                    {
                        DataTable dtTotalRow = new DataTable();
                        da.Fill(dtTotalRow);

                        dt.Rows[0]["Page"] = paging.PageNumber;
                        dt.Rows[0]["PageSize"] = paging.PageSize;
                        dt.Rows[0]["TotalRow"] = dtTotalRow.Rows.Count;
                    }

                    return dt;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public DataTable GetDataTablePaging(SqlCommand command, Paging paging, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                command.Connection = connection;
                command.Transaction = transaction;
                command.CommandTimeout = CommandTimeout;

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataSet ds = new DataSet();
                    da.Fill(ds, paging.StartRecord, paging.PageSize, "Paging");

                    DataTable dt = new DataTable();
                    if (ds.Tables.Count > 0)
                    {
                        dt = ds.Tables[0];
                    }

                    dt.Columns.Add("Page");
                    dt.Columns.Add("PageSize");
                    dt.Columns.Add("TotalRow");

                    if (dt.Rows.Count > 0)
                    {
                        DataTable dtTotalRow = new DataTable();
                        da.Fill(dtTotalRow);

                        dt.Rows[0]["Page"] = paging.PageNumber;
                        dt.Rows[0]["PageSize"] = paging.PageSize;
                        dt.Rows[0]["TotalRow"] = dtTotalRow.Rows.Count;
                    }

                    return dt;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public int GetTotalRowPagingExecuteSqlString(SqlCommand command)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    string sql = command.CommandText;
                    string sqlCount = string.Format("SELECT COUNT(*) FROM ( {0} ) TEMP", sql);

                    command.Connection = connection;
                    command.CommandTimeout = CommandTimeout;
                    command.CommandType = CommandType.Text;
                    command.CommandText = sqlCount;

                    int totalRow = Convert.ToInt32(command.ExecuteScalar());
                    return totalRow;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public List<T> GetDataListPagingExecuteSqlString<T>(SqlCommand command, Paging paging)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    string sql = command.CommandText;
                    string sqlSortBy = string.Format("{0} {1}", paging.SortBy, paging.SortDirection);
                    string Paging = string.Format(@"SELECT *
                                            FROM (SELECT ROW_NUMBER() OVER ( ORDER BY {0} ) AS ROW_NUM, *
                                            FROM ( {1} ) TEMP) TEMP2
                                            WHERE ROW_NUM > @StartRecord AND ROW_NUM <= @EndRecord", sqlSortBy, sql);

                    command.Connection = connection;
                    command.CommandTimeout = CommandTimeout;
                    command.CommandType = CommandType.Text;
                    command.CommandText = Paging;

                    command.Parameters.Add(new SqlParameter("@StartRecord", paging.StartRecord));
                    command.Parameters.Add(new SqlParameter("@EndRecord", paging.EndRecord));

                    using (SqlDataAdapter da = new SqlDataAdapter(command))
                    {
                        DataTable dt = new DataTable();
                        da.Fill(dt);

                        List<T> objectList = ModelHelper.CreateObjectList<T>(dt);

                        return objectList;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public List<T> GetDataListPagingExecuteSqlString<T>(SqlCommand command, Paging paging, SqlConnection connection)
        {
            try
            {
                string sql = command.CommandText;
                string sqlSortBy = string.Format("{0} {1}", paging.SortBy, paging.SortDirection);
                string Paging = string.Format(@"SELECT *
                                            FROM (SELECT ROW_NUMBER() OVER ( ORDER BY {0} ) AS ROW_NUM, *
                                            FROM ( {1} ) TEMP) TEMP2
                                            WHERE ROW_NUM > @StartRecord AND ROW_NUM <= @EndRecord", sqlSortBy, sql);

                command.Connection = connection;
                command.CommandTimeout = CommandTimeout;
                command.CommandType = CommandType.Text;
                command.CommandText = Paging;

                command.Parameters.Add(new SqlParameter("@StartRecord", paging.StartRecord));
                command.Parameters.Add(new SqlParameter("@EndRecord", paging.EndRecord));

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    List<T> objectList = ModelHelper.CreateObjectList<T>(dt);

                    return objectList;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public List<T> GetDataListPagingExecuteSqlString<T>(SqlCommand command, Paging paging, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                string sql = command.CommandText;
                string sqlSortBy = string.Format("{0} {1}", paging.SortBy, paging.SortDirection);
                string Paging = string.Format(@"SELECT *
                                            FROM (SELECT ROW_NUMBER() OVER ( ORDER BY {0} ) AS ROW_NUM, *
                                            FROM ( {1} ) TEMP) TEMP2
                                            WHERE ROW_NUM > @StartRecord AND ROW_NUM <= @EndRecord", sqlSortBy, sql);

                command.Connection = connection;
                command.Transaction = transaction;
                command.CommandTimeout = CommandTimeout;
                command.CommandType = CommandType.Text;
                command.CommandText = Paging;

                command.Parameters.Add(new SqlParameter("@StartRecord", paging.StartRecord));
                command.Parameters.Add(new SqlParameter("@EndRecord", paging.EndRecord));

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    List<T> objectList = ModelHelper.CreateObjectList<T>(dt);

                    return objectList;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public DataTable GetDataTablePagingExecuteSqlString(SqlCommand command, Paging paging)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    string sql = command.CommandText;
                    string sqlCount = string.Format("SELECT COUNT(*) FROM ( {0} ) TEMP", sql);

                    command.Connection = connection;
                    command.CommandTimeout = CommandTimeout;
                    command.CommandType = CommandType.Text;
                    command.CommandText = sqlCount;

                    int totalRow = Convert.ToInt32(command.ExecuteScalar());

                    string sqlSortBy = string.Format("{0} {1}", paging.SortBy, paging.SortDirection);
                    string Paging = string.Format(@"SELECT *
                                            FROM (SELECT ROW_NUMBER() OVER ( ORDER BY {0} ) AS ROW_NUM, *
                                            FROM ( {1} ) TEMP) TEMP2
                                            WHERE ROW_NUM > @StartRecord AND ROW_NUM <= @EndRecord", sqlSortBy, sql);

                    command.Connection = connection;
                    command.CommandTimeout = CommandTimeout;
                    command.CommandType = CommandType.Text;
                    command.CommandText = Paging;

                    command.Parameters.Add(new SqlParameter("@StartRecord", paging.StartRecord));
                    command.Parameters.Add(new SqlParameter("@EndRecord", paging.EndRecord));

                    using (SqlDataAdapter da = new SqlDataAdapter(command))
                    {
                        DataTable dt = new DataTable();
                        da.Fill(dt);

                        dt.Columns.Add("Page");
                        dt.Columns.Add("PageSize");
                        dt.Columns.Add("TotalRow");

                        if (dt.Rows.Count > 0)
                        {
                            dt.Rows[0]["Page"] = paging.PageNumber;
                            dt.Rows[0]["PageSize"] = paging.PageSize;
                            dt.Rows[0]["TotalRow"] = totalRow;
                        }

                        return dt;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public DataTable GetDataTablePagingExecuteSqlString(SqlCommand command, Paging paging, SqlConnection connection)
        {
            try
            {
                string sql = command.CommandText;
                string sqlCount = string.Format("SELECT COUNT(*) FROM ( {0} ) TEMP", sql);

                command.Connection = connection;
                command.CommandTimeout = CommandTimeout;
                command.CommandType = CommandType.Text;
                command.CommandText = sqlCount;

                int totalRow = Convert.ToInt32(command.ExecuteScalar());

                string sqlSortBy = string.Format("{0} {1}", paging.SortBy, paging.SortDirection);
                string Paging = string.Format(@"SELECT *
                                            FROM (SELECT ROW_NUMBER() OVER ( ORDER BY {0} ) AS ROW_NUM, *
                                            FROM ( {1} ) TEMP) TEMP2
                                            WHERE ROW_NUM > @StartRecord AND ROW_NUM <= @EndRecord", sqlSortBy, sql);

                command.Connection = connection;
                command.CommandTimeout = CommandTimeout;
                command.CommandType = CommandType.Text;
                command.CommandText = Paging;

                command.Parameters.Add(new SqlParameter("@StartRecord", paging.StartRecord));
                command.Parameters.Add(new SqlParameter("@EndRecord", paging.EndRecord));

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    dt.Columns.Add("Page");
                    dt.Columns.Add("PageSize");
                    dt.Columns.Add("TotalRow");

                    if (dt.Rows.Count > 0)
                    {
                        dt.Rows[0]["Page"] = paging.PageNumber;
                        dt.Rows[0]["PageSize"] = paging.PageSize;
                        dt.Rows[0]["TotalRow"] = totalRow;
                    }

                    return dt;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public DataTable GetDataTablePagingExecuteSqlString(SqlCommand command, Paging paging, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                string sql = command.CommandText;
                string sqlCount = string.Format("SELECT COUNT(*) FROM ( {0} ) TEMP", sql);

                command.Connection = connection;
                command.Transaction = transaction;
                command.CommandTimeout = CommandTimeout;
                command.CommandType = CommandType.Text;
                command.CommandText = sqlCount;

                int totalRow = Convert.ToInt32(command.ExecuteScalar());

                string sqlSortBy = string.Format("{0} {1}", paging.SortBy, paging.SortDirection);
                string Paging = string.Format(@"SELECT *
                                            FROM (SELECT ROW_NUMBER() OVER ( ORDER BY {0} ) AS ROW_NUM, *
                                            FROM ( {1} ) TEMP) TEMP2
                                            WHERE ROW_NUM > @StartRecord AND ROW_NUM <= @EndRecord", sqlSortBy, sql);

                command.Connection = connection;
                command.Transaction = transaction;
                command.CommandTimeout = CommandTimeout;
                command.CommandType = CommandType.Text;
                command.CommandText = Paging;

                command.Parameters.Add(new SqlParameter("@StartRecord", paging.StartRecord));
                command.Parameters.Add(new SqlParameter("@EndRecord", paging.EndRecord));

                using (SqlDataAdapter da = new SqlDataAdapter(command))
                {
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    dt.Columns.Add("Page");
                    dt.Columns.Add("PageSize");
                    dt.Columns.Add("TotalRow");

                    if (dt.Rows.Count > 0)
                    {
                        dt.Rows[0]["Page"] = paging.PageNumber;
                        dt.Rows[0]["PageSize"] = paging.PageSize;
                        dt.Rows[0]["TotalRow"] = totalRow;
                    }

                    return dt;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        #endregion Execute Select Data with Paging

        #region Execute Select Scalar

        public T GetDataScalar<T>(SqlCommand command)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    command.Connection = connection;
                    command.CommandTimeout = CommandTimeout;

                    T objectScalar = (T)command.ExecuteScalar();

                    return objectScalar;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public T GetDataScalar<T>(SqlCommand command, SqlConnection connection)
        {
            try
            {
                command.Connection = connection;
                command.CommandTimeout = CommandTimeout;

                T objectScalar = (T)command.ExecuteScalar();

                return objectScalar;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public T GetDataScalar<T>(SqlCommand command, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                command.Connection = connection;
                command.Transaction = transaction;
                command.CommandTimeout = CommandTimeout;

                T objectScalar = (T)command.ExecuteScalar();

                return objectScalar;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        #endregion Execute Select Scalar
    }
}
