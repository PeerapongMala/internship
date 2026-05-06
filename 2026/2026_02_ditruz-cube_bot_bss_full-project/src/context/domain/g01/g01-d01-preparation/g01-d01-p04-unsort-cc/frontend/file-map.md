# Preparation Unsort CC — Frontend File Map

Path ทั้งหมด relative จาก `project/frontend/BSS_WEB/`

> **หมายเหตุ:** หน้านี้ใช้ชื่อ "UnsoftCC" ใน view/asset (ชื่อเดิม) แต่ใช้ "UnsortCC" ใน controller/service

## Core Files

| ประเภท | Path |
|--------|------|
| **Controller** | `Controllers/PreparationUnsortCCController.cs` |
| **View** | `Views/Preparation/PreparationUnsoftCC/Index.cshtml` |
| View Code-Behind | `Views/Preparation/PreparationUnsoftCC/Index.cshtml.cs` |
| **Print View** | `Views/Preparation/PreparationUnsoftCC/PreparationUnsoftCCPrint.cshtml` |
| Print Code-Behind | `Views/Preparation/PreparationUnsoftCC/PreparationUnsoftCCPrint.cshtml.cs` |
| **Second Screen View** | `Views/Preparation/SecondScreenPreparationUnsortCC/Index.cshtml` |
| Second Screen Code-Behind | `Views/Preparation/SecondScreenPreparationUnsortCC/Index.cshtml.cs` |
| **Service** | `Services/PreparationUnsortCCService.cs` |
| **Interface** | `Interfaces/IPreparationUnsortCCService.cs` |

## Models (Object)

| Path |
|------|
| `Models/ObjectModel/DeletePreparationUnsortCcRequest.cs` |
| `Models/ObjectModel/DeletePreparationUnsortCcResponse.cs` |
| `Models/ObjectModel/EditPreparationUnsortCcRequest.cs` |
| `Models/ObjectModel/EditPreparationUnsortCcResponse.cs` |

## Models (Service)

| Path |
|------|
| `Models/ServiceModel/Preparation/PreparationUnsortCCRequest.cs` |
| `Models/ServiceModel/Preparation/PreparationUnsortCCResult.cs` |

## Models (Report)

| Path |
|------|
| `Models/Report/Preparation/PreparationUnsortCCReportModel.cs` |
| `Models/Report/Preparation/PreparationUnsortCCReportRequest.cs` |

## Static Assets

| ประเภท | Path |
|--------|------|
| CSS | `wwwroot/css/preparation/preparationUnsoftCC.css` |
| CSS (พิมพ์) | `wwwroot/css/preparation/preparationUnsoftCCPrint.css` |
| CSS (เพิ่มเติม) | `wwwroot/css/preparation/unsortCC.css` |
| JS | `wwwroot/js/preparation/preparationUnsoftCC.js` |
| JS (พิมพ์) | `wwwroot/js/preparation/preparationUnsoftCCPrint.js` |
| JS (จอที่ 2) | `wwwroot/js/preparation/secondScreenPreparationUnsortCC.js` |
| Excel Template | `Excels/PreparationUnsortCCTemplate.xlsx` |
