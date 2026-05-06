using System.Data;
using System.Reflection;

namespace BSS_API.Helpers
{
    public class ModelHelper
    {
        #region Create Object from DataTable

        public static List<T> CreateObjectList<T>(DataTable dataTable)
        {
            try
            {
                List<T> objectList = new List<T>();

                if (dataTable != null)
                {
                    foreach (DataRow row in dataTable.Rows)
                    {
                        T objectNew = Activator.CreateInstance<T>();

                        foreach (PropertyInfo objectProperty in objectNew.GetType().GetProperties())
                        {
                            if (dataTable.Columns.Contains(objectProperty.Name))
                            {
                                DataColumn col = dataTable.Columns[objectProperty.Name];

                                if (row.IsNull(col)) // Check value DBNull
                                {
                                    objectProperty.SetValue(objectNew, null, null);
                                }
                                else
                                {
                                    Type t = Nullable.GetUnderlyingType(objectProperty.PropertyType) ?? objectProperty.PropertyType;
                                    object safeValue = (row[col] == null) ? null : Convert.ChangeType(row[col], t);

                                    objectProperty.SetValue(objectNew, safeValue, null);
                                }
                            }
                        }

                        objectList.Add(objectNew);
                    }
                }

                return objectList;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public static T CreateObject<T>(DataTable dataTable)
        {
            try
            {
                T objectNew = Activator.CreateInstance<T>();

                if (dataTable != null && dataTable.Rows.Count > 0)
                {
                    DataRow row = dataTable.Rows[0];

                    foreach (PropertyInfo objectProperty in objectNew.GetType().GetProperties())
                    {
                        if (dataTable.Columns.Contains(objectProperty.Name))
                        {
                            DataColumn col = dataTable.Columns[objectProperty.Name];

                            if (row.IsNull(col)) // Check value DBNull
                            {
                                objectProperty.SetValue(objectNew, null, null);
                            }
                            else
                            {
                                Type t = Nullable.GetUnderlyingType(objectProperty.PropertyType) ?? objectProperty.PropertyType;
                                object safeValue = (row[col] == null) ? null : Convert.ChangeType(row[col], t);

                                objectProperty.SetValue(objectNew, safeValue, null);
                            }
                        }
                    }
                }

                return objectNew;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        #endregion Create Object from DataTable

        #region Create DataTable from Object

        public static DataTable ObjectListToDataTable<T>(IEnumerable<T> list)
        {
            try
            {
                Type type = typeof(T);
                var properties = type.GetProperties();

                DataTable dataTable = new DataTable();

                foreach (PropertyInfo info in properties)
                {
                    dataTable.Columns.Add(new DataColumn(info.Name, Nullable.GetUnderlyingType(info.PropertyType) ?? info.PropertyType));
                }

                foreach (T entity in list)
                {
                    object[] values = new object[properties.Length];

                    for (int i = 0; i < properties.Length; i++)
                    {
                        values[i] = properties[i].GetValue(entity);
                    }

                    dataTable.Rows.Add(values);
                }

                return dataTable;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static DataTable ObjectToDataTable<T>(T data)
        {
            try
            {
                List<T> list = new List<T>();
                list.Add(data);

                DataTable dataTable = ObjectListToDataTable(list);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        #endregion Create DataTable from Object
    }
}
