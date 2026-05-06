package g01D0001globalannounceV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"

	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	//(G02D01P01 - learning-area) Section นี้ Test แล้วสามารถใช้ได้แล้ว //
	app.Post(path+"/learning-area", authMiddleware.CheckRoles(constant.ContentCreator), api.LearningAreaCreate)
	app.Patch(path+"/learning-area/:learningAreaId", authMiddleware.CheckRoles(constant.ContentCreator), api.LearningAreaUpdate)
	app.Get(path+"/:curriculumGroupId/learning-area", authMiddleware.CheckRoles(constant.ContentCreator), api.GetLearningArea)
	//(G02D01P02 - content)  Section นี้ Test แล้วสามารถใช้ได้แล้ว //
	app.Post(path+"/content", authMiddleware.CheckRoles(constant.ContentCreator), api.ContentCreate)
	app.Patch(path+"/content/:contentId", authMiddleware.CheckRoles(constant.ContentCreator), api.ContentUpdate)
	app.Get(path+"/:curriculumGroupId/content", authMiddleware.CheckRoles(constant.ContentCreator), api.GetContent)

	//(G02D01P03 - Criteria)  Section นี้ Test แล้วสามารถใช้ได้แล้ว //
	app.Post(path+"/criteria", authMiddleware.CheckRoles(constant.ContentCreator), api.CriteriaCreate)
	app.Patch(path+"/criteria/:criteriaId", authMiddleware.CheckRoles(constant.ContentCreator), api.CriteriaUpdate)
	app.Get(path+"/:curriculumGroupId/criteria", authMiddleware.CheckRoles(constant.ContentCreator), api.GetCriteria)

	//(G02D01P03 - Criteria)  Section นี้ Test แล้วสามารถใช้ได้แล้ว //
	app.Post(path+"/learning-content", authMiddleware.CheckRoles(constant.ContentCreator), api.LearningContentCreate)
	app.Patch(path+"/learning-content/:learningContentId", authMiddleware.CheckRoles(constant.ContentCreator), api.LearningContentUpdate)
	app.Get(path+"/:curriculumGroupId/learning-content", authMiddleware.CheckRoles(constant.ContentCreator), api.GetLearningContent)
	app.Get(path+"/learning-content/download/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.LearningContentCsvDowload)
	app.Post(path+"/learning-content/upload/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.LearningContentUploadCSV)

	//(G02D01P03 - Criteria)  Section นี้ Test แล้วสามารถใช้ได้แล้ว //
	app.Post(path+"/indicators", authMiddleware.CheckRoles(constant.ContentCreator), api.IndicatorsCreate)
	app.Patch(path+"/indicators/:indicatorId", authMiddleware.CheckRoles(constant.ContentCreator), api.IndicatorUpdate)
	app.Get(path+"/:curriculumGroupId/indicators", authMiddleware.CheckRoles(constant.ContentCreator), api.GetIndicators)
	app.Get(path+"/indicators/download/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.IndicatorCsvDowload)
	app.Post(path+"/indicators/upload/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.IndicatorUploadCSV)

	//(G02D01P03 - Criteria)  Section นี้ Test แล้วสามารถใช้ได้แล้ว //
	app.Patch(path+"/sub-criteria/:subCriteriaId", authMiddleware.CheckRoles(constant.ContentCreator), api.SubcriteriaUpdate)
	// app.Patch(path + "/sub-criteria/:subCriteriaId", api.SubcriteriaUpdate)
	app.Get(path+"/sub-criteria/:subCriteriaId/topics", authMiddleware.CheckRoles(constant.ContentCreator), api.GetTopic)
	app.Get(path+"/sub-criteria/:subCriteriaId/topics/download/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.SubcriteriaCsvDowload)
	//(G02D01P03 - Criteria)  Section นี้ Test แล้วสามารถใช้ได้แล้ว //
	app.Post(path+"/sub-criteria/topics", authMiddleware.CheckRoles(constant.ContentCreator), api.SubCriteriaTopicCreate)
	app.Patch(path+"/sub-criteria/topics/:topicId", authMiddleware.CheckRoles(constant.ContentCreator), api.SubCriteriaTopicUpdate)
	app.Get(path+"/sub-criteria/:subCriteriaId/report", authMiddleware.CheckRoles(constant.ContentCreator), api.GetReport)
	app.Get(path+"/sub-criteria/:subCriteriaId/report/download/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.ReportCsvDowload)
	app.Post(path+"/sub-criteria/:subCriteriaId/topics/upload/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.SubCriteriaTopicUploadCSV)

	app.Get(path+"/learning-area/:learningAreaId", authMiddleware.CheckRoles(constant.ContentCreator), api.LearningAreaGet)
	app.Get(path+"/content/:contentId", authMiddleware.CheckRoles(constant.ContentCreator), api.ContentGet)
	app.Get(path+"/criteria/:criteriaId", authMiddleware.CheckRoles(constant.ContentCreator), api.CriteriaGet)
	app.Get(path+"/learning-content/:learningContentId", authMiddleware.CheckRoles(constant.ContentCreator), api.LearningContentGet)
	app.Get(path+"/indicators/:indicatorId", authMiddleware.CheckRoles(constant.ContentCreator), api.IndicatorGet)
	app.Get(path+"/:curriculumGroupId/years", authMiddleware.CheckRoles(constant.ContentCreator), api.YearCaseListByCurriculumGroupId)

	app.Get(path+"/sub-criteria/topics/:topicId", authMiddleware.CheckRoles(constant.ContentCreator), api.SubCriteriaTopicGet)
	app.Get(path+"/:curriculumGroupId/sub-criteria", authMiddleware.CheckRoles(constant.ContentCreator), api.SubCriteriaCaseListByCurriculumGroupId)

	app.Post(path+"/learning-area/bulk-edit", authMiddleware.CheckRoles(constant.ContentCreator), api.LearningAreaCaseBulkEdit)
	app.Post(path+"/content/bulk-edit", authMiddleware.CheckRoles(constant.ContentCreator), api.ContentCaseBulkEdit)
	app.Post(path+"/criteria/bulk-edit", authMiddleware.CheckRoles(constant.ContentCreator), api.CriteriaCaseBulkEdit)
	app.Post(path+"/learning-content/bulk-edit", authMiddleware.CheckRoles(constant.ContentCreator), api.LearningContentCaseBulkEdit)
	app.Post(path+"/indicators/bulk-edit", authMiddleware.CheckRoles(constant.ContentCreator), api.IndicatorCaseBulkEdit)
	app.Post(path+"/sub-criteria/topics/bulk-edit", authMiddleware.CheckRoles(constant.ContentCreator), api.SubCriteriaTopicCaseBulkEdit)

	//csv
	app.Post(path+"/learning-area/upload/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.LearningAreaUploadCSV)
	app.Get(path+"/learning-area/download/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.LearningAreaDownloadCSV)
	app.Post(path+"/content/upload/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.ContentUploadCSV)
	app.Get(path+"/content/download/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.ContentDownloadCSV)
	app.Post(path+"/criteria/upload/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.CriteriaUploadCSV)
	app.Get(path+"/criteria/download/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.CriteriaDownloadCSV)

}
