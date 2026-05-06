package g02d01SchoolAffiliationV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, schoolAffiliationService service.ServiceInterface, path string) {
	api := &service.APiStruct{Service: schoolAffiliationService}

	app.Post(path+"/", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationCreate)
	app.Get(path+"/all/:schoolAffiliationId", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationGet)
	app.Patch(path+"/:schoolAffiliationId", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationUpdate)
	app.Get(path+"/", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationList)
	app.Get(path+"/:schoolAffiliationId/contracts", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationCaseListContract)
	app.Post(path+"/school-affiliations/bulk-edit", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationCaseBulkEdit)
	app.Get(path+"/download/csv", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationCaseDownloadCsv)
	app.Post(path+"/upload/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.SchoolAffiliationCaseUploadCsv)

	app.Post(path+"/doe", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationDoeCreate)
	app.Patch(path+"/doe/:schoolAffiliationId", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationDoeUpdate)
	app.Get(path+"/doe", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationDoeList)

	app.Post(path+"/obec", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationObecCreate)
	app.Patch(path+"/obec/:schoolAffiliationId", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationObecUpdate)
	app.Get(path+"/obec", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationObecList)

	app.Post(path+"/lao", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationLaoCreate)
	app.Patch(path+"/lao/:schoolAffiliationId", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationLaoUpdate)
	app.Get(path+"/lao", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationLaoList)

	app.Post(path+"/contracts", authMiddleware.CheckRoles(constant.Admin), api.ContractCreate)
	app.Get(path+"/contracts/:contractId", authMiddleware.CheckRoles(constant.ContentCreator), api.ContractGet)
	app.Patch(path+"/contracts/:contractId", authMiddleware.CheckRoles(constant.Admin), api.ContractUpdate)
	app.Patch(path+"/contracts/:contractId/schools", authMiddleware.CheckRoles(constant.Admin), api.ContractCaseAddSchool)
	app.Delete(path+"/contracts/:contractId/schools", authMiddleware.CheckRoles(constant.Admin), api.ContractCaseDeleteSchool)
	app.Patch(path+"/contracts/:contractId/subject-groups", authMiddleware.CheckRoles(constant.Admin), api.ContractCaseAddSubjectGroup)
	app.Delete(path+"/contracts/:contractId/subject-groups", authMiddleware.CheckRoles(constant.Admin), api.ContractCaseDeleteSubjectGroup)
	app.Get(path+"/contracts/:contractId/subject-groups", authMiddleware.CheckRoles(constant.Admin), api.ContractCaseListSubjectGroup)
	app.Get(path+"/contracts/:contractId/schools", authMiddleware.CheckRoles(constant.Admin), api.ContractCaseListSchool)
	app.Patch(path+"/contracts/:contractId/subject-groups/:subjectGroupId", authMiddleware.CheckRoles(constant.Admin), api.ContractCaseToggleSubjectGroup)

	app.Get(path+"/subjects/list", authMiddleware.CheckRoles(constant.Admin), api.SubjectList)
	app.Get(path+"/curriculum-groups/list", authMiddleware.CheckRoles(constant.Admin), api.CurriculumGroupList)
	app.Get(path+"/:curriculumGroupId/years", authMiddleware.CheckRoles(constant.Admin), api.YearList)
	app.Get(path+"/platforms/:platformId/subject-groups", authMiddleware.CheckRoles(constant.Admin), api.SubjectGroupList)

	app.Get(path+"/:schoolAffiliationId/schools", authMiddleware.CheckRoles(constant.Admin), api.SchoolCaseListBySchoolAffiliation)
	app.Post(path+"/curriculum-groups/bulk-edit", authMiddleware.CheckRoles(constant.Admin), api.CurriculumGroupCaseBulkEdit)
	app.Get(path+"/curriculum-groups/download/csv", authMiddleware.CheckRoles(constant.Admin), api.CurriculumGroupCaseDownloadCsv)
	app.Post(path+"/curriculum-groups/upload/csv", authMiddleware.CheckRoles(constant.Admin), api.CurriculumGroupCaseUploadCsv)
	app.Post(path+"/curriculum-groups", authMiddleware.CheckRoles(constant.Admin), api.CurriculumGroupCreate)
	app.Get(path+"/curriculum-groups/:curriculumGroupId", authMiddleware.CheckRoles(constant.Admin), api.CurriculumGroupGet)
	app.Patch(path+"/curriculum-groups/:curriculumGroupId", authMiddleware.CheckRoles(constant.Admin), api.CurriculumGroupUpdate)
	app.Get(path+"/content-creators", authMiddleware.CheckRoles(constant.Admin), api.ContentCreatorList)
	app.Post(path+"/curriculum-groups/:curriculumGroupId/content-creators", authMiddleware.CheckRoles(constant.Admin), api.CurriculumGroupCaseUpdateContentCreators)
	app.Get(path+"/curriculum-groups/:curriculumGroupId/content-creators/download/csv", authMiddleware.CheckRoles(constant.Admin), api.CurriculumGroupCaseDownloadContentCreatorCsv)
	app.Post(path+"/curriculum-groups/:curriculumGroupId/content-creators/upload/csv", authMiddleware.CheckRoles(constant.Admin), api.CurriculumGroupCaseUploadContentCreatorCsv)
	app.Post(path+"/seed-years/bulk-edit", authMiddleware.CheckRoles(constant.Admin), api.SeedYearCaseBulkEdit)
	app.Get(path+"/seed-years", authMiddleware.CheckRoles(constant.Admin, constant.Observer), api.SeedYearList)
	app.Post(path+"/seed-years", authMiddleware.CheckRoles(constant.Admin), api.SeedYearCreate)
	app.Get(path+"/seed-years/:seedYearId", authMiddleware.CheckRoles(constant.Admin), api.SeedYearGet)
	app.Patch(path+"/seed-years/:seedYearId", authMiddleware.CheckRoles(constant.Admin), api.SeedYearUpdate)
	app.Get(path+"/seed-years/download/csv", authMiddleware.CheckRoles(constant.Admin), api.SeedYearCaseDownloadCsv)
	app.Post(path+"/seed-years/upload/csv", authMiddleware.CheckRoles(constant.Admin), api.SeedYearCaseUploadCsv)

	app.Get(path+"/seed-platforms", authMiddleware.CheckRoles(constant.Admin), api.SeedPlatformList)
	app.Get(path+"/school-affiliations/:schoolAffiliationId/contracts", authMiddleware.CheckRoles(constant.Admin), api.ContractCaseDownloadCsv)
	app.Post(path+"/contracts/:contractId/refresh", authMiddleware.CheckRoles(constant.Admin), api.ContractRefresh)
}
