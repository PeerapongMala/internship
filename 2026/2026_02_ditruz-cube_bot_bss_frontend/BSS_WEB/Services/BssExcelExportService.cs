using BSS_WEB.Interfaces;
using BSS_WEB.Models.Report;
using BSS_WEB.Models.Report.Preparation;
using BSS_WEB.Models.Report.RegisterUnsort;
using BSS_WEB.Services.Template;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Spreadsheet;

namespace BSS_WEB.Services
{
    public class BssExcelExportService : BssExcelExportServiceTemplate, IBssExcelExportService
    {
        public BssExcelExportService() : base()
        {
            base._xlWorkbook = new XLWorkbook();
        }
        public BssExcelExportService(string reportFileName, string excelFolderName = "Excels")
            : base(reportFileName, excelFolderName)
        {
        }

        public XLWorkbook ExportPreparationUnfitToWorkbook(PreparationUnfitReportModel preparationUnfitReportModel)
        {
            // สร้าง Workbook และ Worksheet ใหม่ทันที
            var workbook = new XLWorkbook();
            var ws = workbook.Worksheets.Add("Preparation Unfit");

            #region 1. จัดการหัวรายงาน (Report Header)
            ws.Cell("A1").Value = preparationUnfitReportModel.ReportTitle;
            ws.Cell("A1").Style.Font.FontSize = 16;
            ws.Cell("A1").Style.Font.Bold = true;
            ws.Range("A1:J1").Merge().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            // ผสานเซลล์ A2 ถึง C2 สำหรับ Supervisor
            ws.Cell("A2").Value = $"Supervisor: {preparationUnfitReportModel.ReportHeader.SupervisorName}";
            ws.Range("A2:C2").Merge().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;

            // วันที่พิมพ์ (คอลัมน์ I ถึง J)
            ws.Cell("I2").Value = $"วันที่พิมพ์: {preparationUnfitReportModel.ReportHeader.RegisterDate}";
            ws.Range("I2:J2").Merge();

            // ผสานเซลล์ A3 ถึง C3 สำหรับ ศูนย์ CCC
            ws.Cell("A3").Value = $"ศูนย์ CCC: {preparationUnfitReportModel.ReportHeader.DepartmentName}";
            ws.Range("A3:C3").Merge().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;

            // เครื่องจักร (คอลัมน์ I ถึง J)
            ws.Cell("I3").Value = $"เครื่องจักร: {preparationUnfitReportModel.ReportHeader.MachineName}";
            ws.Range("I3:J3").Merge();
            #endregion

            #region 2. สร้างหัวตาราง (Table Header)
            int row = 5;
            string[] headers = {"ลำดับ", "บาร์โค้ดภาชนะ", "บาร์โค้ดรายห่อ", "บาร์โค้ดรายมัด","Header Card", "ธนาคาร", "ศูนย์เงินสด", "ราคา","วันที่เตรียม", "ผู้เตรียม"};

            for (int i = 0; i < headers.Length; i++)
            {
                var cell = ws.Cell(row, i + 1);
                cell.Value = headers[i];
                cell.Style.Font.Bold = true;
                cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#EFEFEF");
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            }
            row++;
            #endregion

            #region 3. เขียนข้อมูล (Data Rows)
            int index = 1;
            foreach (var item in preparationUnfitReportModel.ReportDetail)
            {
                ws.Cell(row, 1).Value = index++;
                ws.Cell(row, 2).Value = item.BarcodeContainer;
                ws.Cell(row, 3).Value = item.BarcodeWrap;
                ws.Cell(row, 4).Value = item.BarcodeBundle;
                ws.Cell(row, 5).Value = item.HeaderCard;
                ws.Cell(row, 6).Value = item.InstitutionCode;
                ws.Cell(row, 7).Value = item.CashCenterName;
                ws.Cell(row, 8).Value = item.DenominationPrice;
                ws.Cell(row, 9).Value = item.PreparaDateTime;
                ws.Cell(row, 10).Value = item.PreparatorName;

                // ใส่เส้นขอบ
                ws.Range(row, 1, row, 10).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                row++;
            }
            #endregion

            #region 4. ส่วนสรุปท้าย (Summary)
            row += 2;
            // เขียนหัวข้อ และผสานเซลล์ A ถึง C ของแถวนั้น
            ws.Cell(row, 1).Value = "สรุปข้อมูลภาชนะ";
            ws.Cell(row, 1).Style.Font.Bold = true;
            ws.Range(row, 1, row, 3).Merge().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;

            row++; // เลื่อนไปแถวถัดไปเพื่อเขียนหัวตาราง Summary

            // หัวตาราง Summary
            ws.Cell(row, 1).Value = "บาร์โค้ดภาชนะ";
            ws.Cell(row, 2).Value = "จำนวนมัดรวม";
            ws.Cell(row, 3).Value = "จำนวนสถาบันการเงิน";
            ws.Range(row, 1, row, 3).Style.Font.Bold = true;
            ws.Range(row, 1, row, 3).Style.Fill.BackgroundColor = XLColor.FromHtml("#EFEFEF");
            ws.Range(row, 1, row, 3).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            row++;

            foreach (var sum in preparationUnfitReportModel.ReportSummary.ReportSummaryDetail)
            {
                ws.Cell(row, 1).Value = sum.BarcodeContainer;
                ws.Cell(row, 2).Value = sum.TotalBundle;
                ws.Cell(row, 3).Value = sum.TotalInstitution;
                row++;
            }
            #endregion

            // ปรับความกว้างอัตโนมัติ
            ws.Columns().AdjustToContents();

            return workbook;
        }
        
        public XLWorkbook? ExportPreparationUnsortCAMemberToWorkbook(PreparationUnsortCAMemberReportModel model)
        {
            try
            {
                if (base._xlWorkbook == null)
                {
                    throw new Exception("Excel workbook is not initialized.");
                }

                var ws = base._xlWorkbook.Worksheet(1);

                var tables = ws.Tables.ToList();
                foreach (var table in tables)
                {
                    ws.Tables.Remove(table.Name);
                }

                int row = 1;

                #region 1. Excel Header (ส่วนหัวรายงาน)
                // บรรทัดที่ 1: ชื่อรายงาน
                ws.Cell(row, 1).Value = model.ReportTitle;
                ws.Cell(row, 1).Style.Font.FontSize = 16;
                ws.Cell(row, 1).Style.Font.Bold = true;
                ws.Range(row, 1, row, 8).Merge().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                row++;

                // บรรทัดที่ 2: Supervisor และ วันที่พิมพ์
                ws.Cell(row, 1).Value = $"Supervisor: {model.ReportHeader.SupervisorName}";
                ws.Range(row, 1, row, 3).Merge();

                ws.Cell(row, 7).Value = $"วันที่พิมพ์: {model.ReportHeader.RegisterDate}";
                ws.Range(row, 7, row, 8).Merge();
                row++;

                // บรรทัดที่ 3: ศูนย์ CCC และ เครื่องจักร
                ws.Cell(row, 1).Value = $"ศูนย์ CCC: {model.ReportHeader.DepartmentName}";
                ws.Range(row, 1, row, 3).Merge();

                ws.Cell(row, 7).Value = $"เครื่องจักร: {model.ReportHeader.MachineName}";
                ws.Range(row, 7, row, 8).Merge();
                row += 2; // เว้นบรรทัดก่อนเริ่มตาราง
                #endregion

                #region 2. Main Table Header (หัวตารางข้อมูล)
                string[] mainHeaders = { "ลำดับ", "บาร์โค้ดภาชนะ", "Header Card", "ธนาคาร", "Cashpoint", "ราคา", "วันเวลา/เตรียม", "ผู้เตรียมธนบัตร" };
                for (int i = 0; i < mainHeaders.Length; i++)
                {
                    var cell = ws.Cell(row, i + 1);
                    cell.Value = mainHeaders[i];
                    cell.Style.Font.Bold = true;
                    cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#E9ECEF"); // สีเทาอ่อนแบบ Header ตาราง
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                }
                row++;
                #endregion

                #region 3. Excel Table Data (ข้อมูลรายการ)
                int index = 1;
                int tableStartRow = row;

                foreach (var detail in model.ReportDetail)
                {
                    ws.Cell(row, 1).Value = index++;
                    ws.Cell(row, 2).Value = detail.BarcodeContainer;
                    ws.Cell(row, 3).Value = detail.HeaderCard;
                    ws.Cell(row, 4).Value = detail.InstitutionCode;
                    ws.Cell(row, 5).Value = detail.CashPointName;
                    ws.Cell(row, 6).Value = detail.DenominationPrice;
                    ws.Cell(row, 7).Value = detail.PreparaDateTime;
                    ws.Cell(row, 8).Value = detail.PreparatorName;

                    // ใส่เส้นขอบให้แต่ละเซลล์ในแถว
                    ws.Range(row, 1, row, 8).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    row++;
                }
                #endregion

                #region 4. Excel Summary (ส่วนสรุปข้อมูลภาชนะ)
                row += 2; // เว้น 2 บรรทัดก่อนเริ่มตารางสรุป

                ws.Cell(row, 1).Value = "สรุปข้อมูลภาชนะ";
                ws.Cell(row, 1).Style.Font.Bold = true;
                ws.Cell(row, 1).Style.Font.FontSize = 14;
                row++;

                // หัวตาราง Summary
                string[] summaryHeaders = { "บาร์โค้ดภาชนะ", "จำนวนมัดรวม", "จำนวนสถาบันการเงิน" };
                for (int i = 0; i < summaryHeaders.Length; i++)
                {
                    var cell = ws.Cell(row, i + 1);
                    cell.Value = summaryHeaders[i];
                    cell.Style.Font.Bold = true;
                    cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#E9ECEF");
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                }
                row++;

                // ข้อมูลสรุปรายภาชนะ
                if (model.ReportSummary?.ReportSummaryDetail != null)
                {
                    foreach (var summary in model.ReportSummary.ReportSummaryDetail)
                    {
                        ws.Cell(row, 1).Value = summary.BarcodeContainer;
                        ws.Cell(row, 2).Value = summary.TotalBundle;
                        ws.Cell(row, 3).Value = summary.TotalInstitution;

                        ws.Range(row, 1, row, 3).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                        row++;
                    }
                }

                // แถวรวมทั้งหมด (Total All)
                ws.Cell(row, 1).Value = "รวมทั้งหมด:";
                ws.Cell(row, 1).Style.Font.Bold = true;
                ws.Cell(row, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

                ws.Cell(row, 2).Value = model.ReportSummary?.TotalAllBundle;
                ws.Cell(row, 2).Style.Font.Bold = true;

                ws.Cell(row, 3).Value = model.ReportSummary?.TotalAllInstitution;
                ws.Cell(row, 3).Style.Font.Bold = true;

                ws.Range(row, 1, row, 3).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                #endregion

                // ปรับความกว้างคอลัมน์อัตโนมัติ (A-H)
                ws.Columns(1, 8).AdjustToContents();

                return base._xlWorkbook;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public XLWorkbook? ExportPreparationUnsortCANonMemberToWorkbook(PreparationUnsortCANonMemberReportModel preparationUnsortCANonMemberReportModel)
        {
            try
            {
                // 1. ตรวจสอบว่า Workbook ถูกสร้างหรือยัง
                if (base._xlWorkbook == null)
                {
                    base._xlWorkbook = new XLWorkbook();
                }

                // 2. ตรวจสอบว่ามี Worksheet หรือยัง ถ้ายังไม่มีให้ Add เข้าไปใหม่
                if (base._xlWorkbook.Worksheets.Count == 0)
                {
                    base._xlWorkbook.Worksheets.Add("Report");
                }

                // 3. เรียกใช้งาน Worksheet (ใช้แบบนี้จะปลอดภัยกว่า Worksheet(1))
                var ws = base._xlWorkbook.Worksheet(1);

                var tables = ws.Tables.ToList();
                foreach (var table in tables)
                {
                    ws.Tables.Remove(table.Name);
                }

                int row = 1;

                #region 1. จัดการหัวรายงาน (Report Header)
                // บรรทัดที่ 1: ชื่อรายงาน
                ws.Cell(row, 1).Value = preparationUnsortCANonMemberReportModel.ReportTitle;
                ws.Cell(row, 1).Style.Font.FontSize = 16;
                ws.Cell(row, 1).Style.Font.Bold = true;
                ws.Range(row, 1, row, 8).Merge().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                row++;

                // บรรทัดที่ 2: Supervisor และ วันที่พิมพ์
                ws.Cell(row, 1).Value = $"Supervisor: {preparationUnsortCANonMemberReportModel.ReportHeader.SupervisorName}";
                ws.Range(row, 1, row, 3).Merge(); // ผสาน A2:C2 ตามที่ต้องการ

                ws.Cell(row, 7).Value = $"วันที่พิมพ์: {preparationUnsortCANonMemberReportModel.ReportHeader.RegisterDate}";
                ws.Range(row, 7, row, 8).Merge();
                row++;

                // บรรทัดที่ 3: ศูนย์ CCC และ เครื่องจักร
                ws.Cell(row, 1).Value = $"ศูนย์ CCC: {preparationUnsortCANonMemberReportModel.ReportHeader.DepartmentName}";
                ws.Range(row, 1, row, 3).Merge(); // ผสาน A3:C3 ตามที่ต้องการ

                ws.Cell(row, 7).Value = $"เครื่องจักร: {preparationUnsortCANonMemberReportModel.ReportHeader.MachineName}";
                ws.Range(row, 7, row, 8).Merge();
                row += 2; // เว้นบรรทัดก่อนเริ่มตาราง
                #endregion

                #region 2. หัวตาราง (Table Header)
                string[] headers = { "ลำดับ", "บาร์โค้ดภาชนะ", "Header Card", "ธนาคาร", "ศูนย์เงินสด", "ราคา", "วันเวลา/เตรียม", "ผู้เตรียมธนบัตร" };
                for (int i = 0; i < headers.Length; i++)
                {
                    var cell = ws.Cell(row, i + 1);
                    cell.Value = headers[i];
                    cell.Style.Font.Bold = true;
                    cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#EFEFEF");
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                }
                row++;
                #endregion

                #region 3. ข้อมูลในตาราง (Excel Table)
                int index = 1;
                int tableStartRow = row;
                foreach (var reportDetail in preparationUnsortCANonMemberReportModel.ReportDetail)
                {
                    ws.Cell(row, 1).Value = index++;
                    ws.Cell(row, 2).Value = reportDetail.BarcodeContainer;
                    ws.Cell(row, 3).Value = reportDetail.HeaderCard;
                    ws.Cell(row, 4).Value = reportDetail.InstitutionCode;
                    ws.Cell(row, 5).Value = reportDetail.CashCenterName;
                    ws.Cell(row, 6).Value = reportDetail.DenominationPrice;
                    ws.Cell(row, 7).Value = reportDetail.PreparaDateTime;
                    ws.Cell(row, 8).Value = reportDetail.PreparatorName;

                    // ใส่เส้นขอบให้ข้อมูล
                    ws.Range(row, 1, row, 8).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    row++;
                }
                #endregion

                #region 4. ส่วนสรุปท้าย (Excel Summary)
                row += 1; // เว้นระยะห่างจากตารางหลัก

                // หัวข้อสรุป
                ws.Cell(row, 1).Value = "สรุปข้อมูลภาชนะ";
                ws.Cell(row, 1).Style.Font.Bold = true;
                ws.Range(row, 1, row, 3).Merge().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                row++;

                // หัวตาราง Summary
                ws.Cell(row, 1).Value = "บาร์โค้ดภาชนะ";
                ws.Cell(row, 2).Value = "จำนวนมัดรวม";
                ws.Cell(row, 3).Value = "จำนวนสถาบันการเงิน";
                ws.Range(row, 1, row, 3).Style.Font.Bold = true;
                ws.Range(row, 1, row, 3).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                row++;

                foreach (var summaryDetail in preparationUnsortCANonMemberReportModel.ReportSummary.ReportSummaryDetail)
                {
                    ws.Cell(row, 1).Value = summaryDetail.BarcodeContainer;
                    ws.Cell(row, 2).Value = summaryDetail.TotalBundle;
                    ws.Cell(row, 3).Value = summaryDetail.TotalInstitution;
                    ws.Range(row, 1, row, 3).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    row++;
                }

                // แถวรวมทั้งหมด
                ws.Cell(row, 1).Value = "รวมทั้งหมด:";
                ws.Cell(row, 1).Style.Font.Bold = true;
                ws.Cell(row, 2).Value = preparationUnsortCANonMemberReportModel.ReportSummary.TotalAllBundle;
                ws.Cell(row, 3).Value = preparationUnsortCANonMemberReportModel.ReportSummary.TotalAllInstitution;
                ws.Range(row, 1, row, 3).Style.Font.Bold = true;
                ws.Range(row, 1, row, 3).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                #endregion

                // ปรับขนาดคอลัมน์อัตโนมัติ (เฉพาะเมื่อข้อมูลไม่เยอะเกินไปเพื่อประสิทธิภาพ)
                if (index < 1000)
                {
                    ws.Columns().AdjustToContents();
                }
                else
                {
                    ws.Columns().Width = 15; // กำหนดค่า default ถ้าข้อมูลเยอะมาก
                }

                return base._xlWorkbook;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public XLWorkbook? ExportPreparationUnsortCCToWorkbook(PreparationUnsortCCReportModel model)
        {
            try
            {
                if (base._xlWorkbook == null)
                {
                    throw new Exception("Excel workbook is not initialized.");
                }

                var ws = base._xlWorkbook.Worksheet(1);

                var tables = ws.Tables.ToList();
                foreach (var table in tables)
                {
                    ws.Tables.Remove(table.Name);
                }

                int row = 1;

                #region ExcelHeader
                // บรรทัดที่ 1: ชื่อรายงาน (Preparation Unsort CC Report)
                ws.Cell(row, 1).Value = model.ReportTitle;
                ws.Cell(row, 1).Style.Font.FontSize = 16;
                ws.Cell(row, 1).Style.Font.Bold = true;
                ws.Range(row, 1, row, 8).Merge().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                row++;

                // บรรทัดที่ 2: Supervisor และ วันที่พิมพ์
                ws.Cell(row, 1).Value = $"Supervisor : {model.ReportHeader.SupervisorName}";
                ws.Range(row, 1, row, 3).Merge();

                ws.Cell(row, 7).Value = $"วันที่พิมพ์ : {model.ReportHeader.RegisterDate}";
                ws.Range(row, 7, row, 8).Merge();
                row++;

                // บรรทัดที่ 3: ศูนย์ CCC และ เครื่องจักร
                ws.Cell(row, 1).Value = $"ศูนย์ CCC : {model.ReportHeader.DepartmentName}";
                ws.Range(row, 1, row, 3).Merge();

                ws.Cell(row, 7).Value = $"เครื่องจักร : {model.ReportHeader.MachineName}";
                ws.Range(row, 7, row, 8).Merge();
                row += 2; // เว้นบรรทัดก่อนเริ่มตาราง
                #endregion ExcelHeader

                #region ExcelTable
                // สร้างหัวตารางหลัก
                string[] headers = { "ลำดับ", "บาร์โค้ดภาชนะ", "Header Card", "ธนาคาร", "Cashpoint", "ราคา", "วันเวลา/เตรียม", "ผู้เตรียมธนบัตร" };
                for (int i = 0; i < headers.Length; i++)
                {
                    var cell = ws.Cell(row, i + 1);
                    cell.Value = headers[i];
                    cell.Style.Font.Bold = true;
                    cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#E9ECEF"); // สีเทาอ่อน
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                }
                row++;

                // ข้อมูลรายการ (7 รายการตามตัวอย่าง)
                int index = 1;
                foreach (var detail in model.ReportDetail)
                {
                    ws.Cell(row, 1).Value = index++;
                    ws.Cell(row, 2).Value = detail.BarcodeContainer;
                    ws.Cell(row, 3).Value = detail.HeaderCard;
                    ws.Cell(row, 4).Value = detail.InstitutionCode;
                    ws.Cell(row, 5).Value = detail.CashPointName;
                    ws.Cell(row, 6).Value = detail.DenominationPrice;
                    ws.Cell(row, 7).Value = detail.PreparaDateTime;
                    ws.Cell(row, 8).Value = detail.PreparatorName;

                    // ตีเส้นขอบ
                    ws.Range(row, 1, row, 8).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    row++;
                }
                #endregion ExcelTable

                #region ExcelSummary
                row += 2; // เว้นระยะ

                ws.Cell(row, 1).Value = "สรุปข้อมูลภาชนะ";
                ws.Cell(row, 1).Style.Font.Bold = true;
                ws.Cell(row, 1).Style.Font.FontSize = 14;
                row++;

                // หัวตาราง Summary
                string[] summaryHeaders = { "บาร์โค้ดภาชนะ", "จำนวนมัดรวม", "จำนวนสถาบันการเงิน" };
                for (int i = 0; i < summaryHeaders.Length; i++)
                {
                    var cell = ws.Cell(row, i + 1);
                    cell.Value = summaryHeaders[i];
                    cell.Style.Font.Bold = true;
                    cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#E9ECEF");
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                }
                row++;

                // รายละเอียด Summary (KK26054, KK26055)
                if (model.ReportSummary?.ReportSummaryDetail != null)
                {
                    foreach (var summary in model.ReportSummary.ReportSummaryDetail)
                    {
                        ws.Cell(row, 1).Value = summary.BarcodeContainer;
                        ws.Cell(row, 2).Value = summary.TotalBundle;
                        ws.Cell(row, 3).Value = summary.TotalInstitution;

                        ws.Range(row, 1, row, 3).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                        row++;
                    }
                }

                // แถวผลรวม (Total All)
                ws.Cell(row, 1).Value = "รวมทั้งหมด:";
                ws.Cell(row, 1).Style.Font.Bold = true;
                ws.Cell(row, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

                ws.Cell(row, 2).Value = model.ReportSummary?.TotalAllBundle;
                ws.Cell(row, 2).Style.Font.Bold = true;

                ws.Cell(row, 3).Value = model.ReportSummary?.TotalAllInstitution;
                ws.Cell(row, 3).Style.Font.Bold = true;

                ws.Range(row, 1, row, 3).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                #endregion ExcelSummary

                // ปรับขนาดคอลัมน์อัตโนมัติ
                ws.Columns(1, 8).AdjustToContents();

                return base._xlWorkbook;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public XLWorkbook? ExportRegisterUnsortToWorkbook(RegisterUnsortReportModel model)
        {
            try
            {
                if (base._xlWorkbook == null)
                    throw new Exception("Excel workbook is not initialized.");

                var ws = base._xlWorkbook.Worksheet(1);

                #region ExcelHeader
                // บรรทัดที่ 1: ชื่อรายงาน
                ws.Cell("A1").Value = model.ReportTitle;
                ws.Cell("A1").Style.Font.Bold = true;
                ws.Cell("A1").Style.Font.FontSize = 16;
                ws.Range("A1:F1").Merge().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                // บรรทัดที่ 2: ข้อมูลภาชนะและวันที่ (ใช้ชื่อตาม Model ของคุณ)
                ws.Cell("A2").Value = $"บาร์โค้ดภาชนะ : {model.ReportHeader.BarcodeContainer}";
                ws.Cell("E2").Value = $"วันที่ลงทะเบียน : {model.ReportHeader.RegisterDate}";

                // บรรทัดที่ 3-4: ผู้ใช้งานและหน่วยงาน
                ws.Cell("A3").Value = $"Operator : {model.ReportHeader.OperatorName}";
                ws.Cell("A4").Value = $"ศูนย์นับคัด : {model.ReportHeader.DepartmentName}";
                #endregion ExcelHeader

                #region ExcelTable
                int startRow = 6;
                int row = startRow;

                // --- Table Header ---
                string[] headers = { "ลำดับ", "ธนาคาร", "ชนิดราคา", "จำนวน (มัด)", "วันที่ลงทะเบียน", "ผู้บันทึก/เครื่อง" };
                for (int i = 0; i < headers.Length; i++)
                {
                    var cell = ws.Cell(row, i + 1);
                    cell.Value = headers[i];
                    cell.Style.Font.Bold = true;
                    cell.Style.Fill.BackgroundColor = XLColor.LightGray;
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                }

                row++;

                // --- Table Body ---
                int index = 1;
                foreach (var detail in model.ReportDetail)
                {
                    ws.Cell(row, 1).Value = index++;
                    ws.Cell(row, 2).Value = detail.InstitutionName;
                    ws.Cell(row, 3).Value = detail.DenominationPrice;
                    ws.Cell(row, 4).Value = detail.TotalBundle;
                    ws.Cell(row, 5).Value = detail.CreatedDate;
                    ws.Cell(row, 6).Value = detail.CreatedName;

                    ws.Range(row, 1, row, 6).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    ws.Cell(row, 4).Style.NumberFormat.Format = "#,##0";
                    row++;
                }
                #endregion ExcelTable

                #region ExcelSummary
                row += 2; // เว้นระยะ

                // หัวข้อสรุปข้อมูลภาชนะ
                ws.Cell(row, 1).Value = "สรุปข้อมูลภาชนะ";
                ws.Range(row, 1, row, 3).Merge().Style.Font.Bold = true;
                ws.Range(row, 1, row, 3).Style.Fill.BackgroundColor = XLColor.FromHtml("#D9EAD3");
                ws.Range(row, 1, row, 3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                ws.Range(row, 1, row, 3).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

                row++;
                ws.Cell(row, 1).Value = "บาร์โค้ดภาชนะ";
                ws.Cell(row, 2).Value = "จำนวนมัดรวม";
                ws.Cell(row, 3).Value = "จำนวนสถาบันการเงิน";
                ws.Range(row, 1, row, 3).Style.Font.Bold = true;
                ws.Range(row, 1, row, 3).Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                ws.Range(row, 1, row, 3).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

                row++;
                // ดึงค่าจาก Summary Model โดยตรงตามชื่อ Property
                ws.Cell(row, 1).Value = model.ReportSummary.BarcodeContainer;
                ws.Cell(row, 2).Value = model.ReportSummary.TotalAllBundle;
                ws.Cell(row, 3).Value = model.ReportSummary.TotalAllInstitution;

                var summaryDataRange = ws.Range(row, 1, row, 3);
                summaryDataRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                summaryDataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                summaryDataRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                ws.Cell(row, 2).Style.NumberFormat.Format = "#,##0";
                #endregion ExcelSummary

                ws.Columns().AdjustToContents();
                return base._xlWorkbook;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public XLWorkbook? ExportSendUnsortDeliveryToWorkbook(SendUnsortDeliveryReportModel sendUnsortDeliveryReportModel)
        {
            try
            {
                if (base._xlWorkbook == null)
                {
                    throw new Exception("Excel workbook is not initialized.");
                }

                var ws = base._xlWorkbook.Worksheet(1);

                #region ExcelHeader
                // สมมติว่า Template มีหัวข้อที่ Row 1 และเราจะใส่ข้อมูล Header ใน Row ที่กำหนด
                // หรือจะแทรกบรรทัดใหม่ด้านบนก็ได้ครับ
                ws.Cell("A1").Value = sendUnsortDeliveryReportModel.ReportTitle;
                ws.Cell("A1").Style.Font.Bold = true;
                ws.Cell("A1").Style.Font.FontSize = 16;

                ws.Cell("A2").Value = $"รหัสเอกสาร : {sendUnsortDeliveryReportModel.ReportHeader.SendUnsortCode}";
                ws.Cell("D2").Value = $"วันที่ : {sendUnsortDeliveryReportModel.ReportHeader.PrintDate}";

                ws.Cell("A3").Value = $"Supervisor : {sendUnsortDeliveryReportModel.ReportHeader.SupervisorName}";
                ws.Cell("D3").Value = $"Ref Code : {sendUnsortDeliveryReportModel.ReportHeader.RefCode}";

                ws.Cell("A4").Value = $"ศูนย์นับคัด : {sendUnsortDeliveryReportModel.ReportHeader.DepartmentName}";
                #endregion ExcelHeader

                #region ExcelTable

                // เริ่มเขียนข้อมูลตารางที่ Row 6 (เพื่อให้พื้นที่ Header ไม่โดนทับ)
                int startRow = 6;
                int row = startRow;

                // ใส่ Header ของ Table (ถ้า Template ยังไม่มี)
                ws.Cell(row, 1).Value = "ลำดับ";
                ws.Cell(row, 2).Value = "รหัสภาชนะ";
                ws.Cell(row, 3).Value = "สถาบันการเงิน";
                ws.Cell(row, 4).Value = "ชนิดราคา";
                ws.Cell(row, 5).Value = "จำนวน (มัด)";

                // ใส่สีพื้นหลังให้ Header ตาราง
                var headerRange = ws.Range(row, 1, row, 5);
                headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

                row++; // ขยับลงมาเริ่มเขียน Data

                int index = 1;
                foreach (var reportDetail in sendUnsortDeliveryReportModel.ReportDetail)
                {
                    ws.Cell(row, 1).Value = index++;
                    ws.Cell(row, 2).Value = reportDetail.ContainerCode;
                    ws.Cell(row, 3).Value = reportDetail.InstitutionName;
                    ws.Cell(row, 4).Value = reportDetail.DenominationPrice;
                    ws.Cell(row, 5).Value = reportDetail.TotalBundle;

                    // ใส่เส้นขอบให้ Data
                    ws.Range(row, 1, row, 5).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    row++;
                }

                #endregion ExcelTable

                #region ExcelSummary
                // ตัวอย่างการทำยอดรวมท้ายตาราง
                int lastDataRow = row - 1;
                ws.Cell(row, 4).Value = "รวมทั้งสิ้น";
                ws.Cell(row, 4).Style.Font.Bold = true;
                ws.Cell(row, 5).FormulaA1 = $"=SUM(E{startRow + 1}:E{lastDataRow})";
                ws.Cell(row, 5).Style.Font.Bold = true;
                ws.Cell(row, 5).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                #endregion ExcelSummary

                // ปรับขนาดคอลัมน์ให้อัตโนมัติ (AutoFit)
                ws.Columns().AdjustToContents();

                return base._xlWorkbook;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public XLWorkbook ExportBankSummaryToWorkbook(reportBankSummaryResponse data)
        {
            var workbook = new XLWorkbook();
            var ws = workbook.Worksheets.Add("Bank Summary");

            // ตั้งค่า Font เริ่มต้นสำหรับภาษาไทย
            ws.Style.Font.FontName = "Sarabun";
            ws.Style.Font.FontSize = 10;

            // --- 1. ส่วนหัวรายงาน (Title) ---
            ws.Cell(1, 1).Value = data.ReportTitle; // "Bank Summary Report"
            ws.Range(1, 1, 1, 13).Merge().Style
                .Font.SetBold().Font.SetFontSize(16)
                .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);

            // --- 2. ส่วนข้อมูล Header (3 Column Layout เหมือนใน HTML) ---
            // ฝั่งซ้าย
            ws.Cell(3, 1).Value = "Machine:";
            ws.Cell(3, 2).Value = data.MachineName ?? "รวมทุกเครื่อง";
            ws.Cell(4, 1).Value = "Prepared By:";
            ws.Cell(4, 2).Value = data.PreparedBy ?? "-";
            ws.Cell(5, 1).Value = "Reconciled By:";
            ws.Cell(5, 2).Value = data.ReconciledBy ?? "-";

            // ฝั่งกลาง
            ws.Cell(3, 6).Value = data.BranchName ?? "Unsort CA Member";
            ws.Cell(3, 6).Style.Font.Bold = true;
            ws.Cell(4, 6).Value = data.Shift ?? "All Day";
            ws.Cell(5, 6).Value = "Denomination:";
            ws.Cell(5, 7).Value = data.DenominationType ?? "ทั้งหมด";

            // ฝั่งขวา
            ws.Cell(3, 11).Value = "Print Date:";
            ws.Cell(3, 12).Value = data.PrintDate.ToString("d/M/yyyy");
            ws.Cell(4, 11).Value = "Work Date:";
            // กรณีปี พ.ศ. (WorkDate 2569)
            ws.Cell(4, 12).Value = data.WorkDate.ToString("d/M/yyyy", new System.Globalization.CultureInfo("th-TH"));
            ws.Cell(5, 11).Value = "Operator:";
            ws.Cell(5, 12).Value = data.OperatorName ?? "-";
            ws.Cell(6, 11).Value = "Supervisor:";
            ws.Cell(6, 12).Value = data.SupervisorName ?? "-";

            // จัดสไตล์ให้ Header Info เล็กน้อย
            ws.Range(3, 1, 6, 13).Style.Font.FontSize = 10;

            // --- 3. ส่วนหัวตาราง (Row 8) ---
            string[] headers = {
        "ธนาคาร", "ชนิดราคา", "แบบ", "ดี (+)", "เสีย (+)", "Reject (+)",
        "ทำลาย (+)", "ปลอม (0)", "ชำรุด (0)", "รวมก่อนปรับ",
        "มูลค่าก่อนปรับ", "รวมหลังปรับ", "มูลค่าหลังปรับ"
    };

            for (int i = 0; i < headers.Length; i++)
            {
                var cell = ws.Cell(8, i + 1);
                cell.Value = headers[i];
                cell.Style.Font.Bold = true;
                cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#F2F2F2");
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            }

            int currentRow = 9;

            // --- 4. ส่วนข้อมูล (Data Rows) ---
            if (data.BankSummaries != null)
            {
                foreach (var bank in data.BankSummaries)
                {
                    // แถวรวมธนาคาร (สีฟ้า)
                    var bankTotalRange = ws.Range(currentRow, 1, currentRow, 13);
                    bankTotalRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#D9E9FF");
                    bankTotalRange.Style.Font.Bold = true;

                    ws.Cell(currentRow, 1).Value = $"รวม {bank.BankName}";
                    ws.Range(currentRow, 1, currentRow, 3).Merge();

                    FillFinancialMetrics(ws, currentRow, bank);
                    currentRow++;

                    // แถวรายละเอียดชนิดราคา
                    foreach (var denom in bank.Denominations)
                    {
                        ws.Cell(currentRow, 1).Value = bank.BankName;
                        ws.Cell(currentRow, 2).Value = denom.DenominationValue;
                        ws.Cell(currentRow, 3).Value = (denom.ModelSeries == null || denom.ModelSeries == "null") ? "-" : denom.ModelSeries;

                        FillFinancialMetrics(ws, currentRow, denom);
                        currentRow++;
                    }
                }
            }

            // --- 5. แถวรวมทั้งหมด (Grand Total - สีเทา) ---
            if (data.GrandTotal != null)
            {
                var grandTotalRange = ws.Range(currentRow, 1, currentRow, 13);
                grandTotalRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#ADB9CA");
                grandTotalRange.Style.Font.Bold = true;

                ws.Cell(currentRow, 1).Value = "รวมทั้งหมด";
                ws.Range(currentRow, 1, currentRow, 3).Merge();

                FillFinancialMetrics(ws, currentRow, data.GrandTotal);
            }

            // --- 6. การจัดรูปแบบตัวเลขและขอบตาราง ---
            // กำหนด Number Format ให้มี Comma สำหรับตัวเลขทั้งหมด
            ws.Range(9, 4, currentRow, 13).Style.NumberFormat.Format = "#,##0";

            // จัดตำแหน่ง
            ws.Columns(1, 3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // ข้อความ
            ws.Columns(4, 13).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right; // ตัวเลข

            // ตีกรอบ
            var tableRange = ws.Range(8, 1, currentRow, 13);
            tableRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
            tableRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

            // ปรับความกว้างคอลัมน์อัตโนมัติ
            ws.Columns().AdjustToContents();

            return workbook;
        }

        private void FillFinancialMetrics(IXLWorksheet ws, int row, FinancialMetrics metrics)
        {
            ws.Cell(row, 4).Value = metrics.GoodQty;
            ws.Cell(row, 5).Value = metrics.BadQty;
            ws.Cell(row, 6).Value = metrics.RejectQty;
            ws.Cell(row, 7).Value = metrics.DestroyQty;
            ws.Cell(row, 8).Value = metrics.CounterfeitQty;
            ws.Cell(row, 9).Value = metrics.MutilatedQty;
            ws.Cell(row, 10).Value = metrics.TotalQtyBeforeAdjust;
            ws.Cell(row, 11).Value = metrics.TotalValueBeforeAdjust;
            ws.Cell(row, 12).Value = metrics.TotalQtyAfterAdjust;
            ws.Cell(row, 13).Value = metrics.TotalValueAfterAdjust;
        }


        public XLWorkbook ExportCashPointCenterToWorkbook(reportCashPointCenterResponse data)
        {
            var workbook = new XLWorkbook();
            var ws = workbook.Worksheets.Add("Cashpoint_Center");

            // ตั้งค่า Font พื้นฐาน (Sarabun สำหรับภาษาไทย)
            ws.Style.Font.FontName = "Sarabun";
            ws.Style.Font.FontSize = 10;

            // --- 1. Header Report ---
            ws.Cell(1, 1).Value = data.ReportTitle;
            ws.Range(1, 1, 1, 16).Merge().Style.Font.SetBold(true).Font.SetFontSize(16).Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);

            ws.Cell(3, 16).Value = $"วันที่พิมพ์ : {data.PrintDate:d/M/yyyy HH:mm:ss}";
            ws.Cell(3, 16).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);

            // --- 2. Information Header ---
            ws.Cell(5, 1).Value = "วันที่นับคัด :"; ws.Cell(5, 2).Value = data.WorkDate.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("th-TH"));
            ws.Cell(6, 1).Value = "ชนิดราคา :"; ws.Cell(6, 2).Value = data.DenominationType;
            ws.Cell(5, 15).Value = "เครื่องจักร :"; ws.Cell(5, 16).Value = data.MachineName;
            ws.Cell(6, 15).Value = "ผลัด :"; ws.Cell(6, 16).Value = data.Shift;

            // --- 3. Table Header ---
            string[] headers = { "ธนาคาร", "Zone", "Cashpoint", "ชนิดราคา", "ดี (+)", "เสีย (+)", "Reject (+)", "ทำลาย (+)", "ปลอม (0)", "ชำรุด (0)", "รวมก่อนปรับ", "มูลค่าก่อนปรับ", "ขาด (+)", "เกิน (-)", "รวมหลังปรับ", "มูลค่าหลังปรับ" };
            for (int i = 0; i < headers.Length; i++)
            {
                var cell = ws.Cell(8, i + 1);
                cell.Value = headers[i];
                cell.Style.Font.Bold = true;
                cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#E7E6E6");
                cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            }

            // --- 4. Data Processing (Hierarchical Loop) ---
            int currentRow = 9;
            if (data.ReportData?.Institutions != null)
            {
                foreach (var inst in data.ReportData.Institutions)
                {
                    int instStartRow = currentRow;

                    foreach (var zone in inst.Zones)
                    {
                        int zoneStartRow = currentRow;

                        foreach (var denom in zone.Denominations)
                        {
                            foreach (var detail in denom.Details)
                            {
                                ws.Cell(currentRow, 1).Value = inst.InstitutionName;
                                ws.Cell(currentRow, 2).Value = zone.ZoneName;
                                ws.Cell(currentRow, 3).Value = zone.CashPointName;
                                ws.Cell(currentRow, 4).Value = denom.Denomination;

                                // ใส่ข้อมูลตัวเลข
                                ws.Cell(currentRow, 5).Value = detail.GoodAmount;
                                ws.Cell(currentRow, 6).Value = detail.BadAmount;
                                ws.Cell(currentRow, 7).Value = detail.RejectAmount;
                                ws.Cell(currentRow, 8).Value = detail.DestroyAmount;
                                ws.Cell(currentRow, 9).Value = detail.CounterfeitAmount;
                                ws.Cell(currentRow, 10).Value = detail.DamagedAmount;
                                ws.Cell(currentRow, 11).Value = detail.PreAdjustTotal;
                                ws.Cell(currentRow, 12).Value = detail.FinalValue;
                                ws.Cell(currentRow, 13).Value = detail.ShortAmount;
                                ws.Cell(currentRow, 14).Value = detail.OverAmount;
                                ws.Cell(currentRow, 15).Value = detail.FinalTotal;
                                ws.Cell(currentRow, 16).Value = detail.TotalValue;

                                currentRow++;
                            }
                        }
                        // Merge Zone Name (ถ้ามีมากกว่า 1 บรรทัด)
                        if (currentRow - 1 > zoneStartRow)
                            ws.Range(zoneStartRow, 2, currentRow - 1, 2).Merge().Style.Alignment.Vertical = XLAlignmentVerticalValues.Top;
                    }
                    // Merge Institution Name
                    if (currentRow - 1 > instStartRow)
                        ws.Range(instStartRow, 1, currentRow - 1, 1).Merge().Style.Alignment.Vertical = XLAlignmentVerticalValues.Top;
                }
            }

            // --- 5. Grand Total Section ---
            if (data.ReportData?.GrandTotal != null)
            {
                var gt = data.ReportData.GrandTotal;
                var totalRange = ws.Range(currentRow, 1, currentRow, 16);
                totalRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#D9E1F2");
                totalRange.Style.Font.Bold = true;

                ws.Cell(currentRow, 1).Value = "GRAND TOTAL";
                ws.Range(currentRow, 1, currentRow, 4).Merge();

                ws.Cell(currentRow, 5).Value = gt.TotalGood;
                ws.Cell(currentRow, 6).Value = gt.TotalBad;
                ws.Cell(currentRow, 7).Value = gt.TotalReject;
                ws.Cell(currentRow, 8).Value = gt.TotalDestroy;
                ws.Cell(currentRow, 9).Value = gt.TotalCounterfeit;
                ws.Cell(currentRow, 10).Value = gt.TotalDamaged;
                ws.Cell(currentRow, 11).Value = gt.TotalPreAdjust;
                ws.Cell(currentRow, 16).Value = gt.TotalValue; // รวมมูลค่าทั้งสิ้น

                currentRow++;
            }

            // จัด Format ตัวเลขและเส้นตาราง
            var dataRange = ws.Range(8, 1, currentRow - 1, 16);
            dataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            dataRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
            ws.Columns(1, 16).AdjustToContents();

            return workbook;
        }

    }
}
