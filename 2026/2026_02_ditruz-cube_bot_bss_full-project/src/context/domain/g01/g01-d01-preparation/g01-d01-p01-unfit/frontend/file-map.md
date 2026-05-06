# Preparation Unfit — Frontend File Map

Path ทั้งหมด relative จาก `project/frontend/BSS_WEB/`

## Core Files

| ประเภท | Path |
|--------|------|
| **Controller** | `Controllers/PreparationController.cs` *(shared)* |
| **View** | `Views/Preparation/PreparationUnfit/Index.cshtml` |
| View Code-Behind | `Views/Preparation/PreparationUnfit/Index.cshtml.cs` |
| **Print View** | `Views/Preparation/PreparationUnfit/PreparationUnfitPrint.cshtml` |
| **Second Screen View** | `Views/Preparation/SecondScreenPreparationUnfit/Index.cshtml` |
| Second Screen Code-Behind | `Views/Preparation/SecondScreenPreparationUnfit/Index.cshtml.cs` |
| **Service** | `Services/PreparationUnfitService.cs` |
| **Interface** | `Interfaces/IPreparationUnfitService.cs` |

## Models (Object)

| Path |
|------|
| `Models/ObjectModel/PreparationUnfitRequest.cs` |
| `Models/ObjectModel/DeletePreparationUnfitRequest.cs` |
| `Models/ObjectModel/DeletePreparationUnfitResponse.cs` |
| `Models/ObjectModel/EditPreparationUnfitRequest.cs` |
| `Models/ObjectModel/EditPreparationUnfitResponse.cs` |

## Models (Service)

| Path |
|------|
| `Models/ServiceModel/Preparation/PreparationUnfitModel.cs` |
| `Models/ServiceModel/Preparation/PreparationUnfitResult.cs` |
| `Models/ServiceModel/Preparation/PreparationUnfitViewData.cs` |
| `Models/ServiceModel/Preparation/GetPreparationUnfitByDepartmentResult.cs` |

## Models (Report)

| Path |
|------|
| `Models/Report/Preparation/PreparationUnfitReportModel.cs` |
| `Models/Report/Preparation/PreparationUnfitReportRequest.cs` |

## Static Assets

| ประเภท | Path |
|--------|------|
| CSS | `wwwroot/css/preparation/unfit.css` |
| CSS | `wwwroot/css/preparation/preparationUnfit.css` |
| CSS (พิมพ์) | `wwwroot/css/preparation/preparationUnfitPrint.css` |
| JS | `wwwroot/js/preparation/preparationUnfit.js` |
| JS (พิมพ์) | `wwwroot/js/preparation/preparationUnfitPrint.js` |
| JS (จอที่ 2) | `wwwroot/js/preparation/secondScreenPreparationUnfit.js` |
| Excel Template | `Excels/PreparationUnfitTemplate.xlsx` |
