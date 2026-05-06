Fix Exception ซึ่งเกิดขึ้นตอน Start Debugging ใน Visual Studio ที่ไฟล์ project\backend\BSS_API\Repositories\GenericRepository.cs บรรทัด 146
โดยมีข้อความว่า
"Exception has occurred: CLR/Microsoft.Data.SqlClient.SqlException
An exception of type 'Microsoft.Data.SqlClient.SqlException' occurred in BSS_API.dll but was not handled in user code: 'A network-related or instance-specific error occurred while establishing a connection to SQL Server. The server was not found or was not accessible. Verify that the instance name is correct and that SQL Server is configured to allow remote connections. (provider: Named Pipes Provider, error: 40 - Could not open a connection to SQL Server)'
Inner exceptions found, see $exception in variables window for more details.
Innermost exception System.ComponentModel.Win32Exception : The user name or password is incorrect."
