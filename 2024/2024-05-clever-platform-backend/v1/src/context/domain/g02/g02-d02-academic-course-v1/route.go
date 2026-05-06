package g02D02AcademicCourse

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, curriculumGroupService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: curriculumGroupService}

	app.Post(path+"/platforms", authMiddleware.CheckRoles(constant.ContentCreator), api.PlatformCreate)
	app.Get(path+"/platforms/:platformId", authMiddleware.CheckRoles(constant.ContentCreator), api.PlatformGet)
	app.Patch(path+"/platforms/:platformId", authMiddleware.CheckRoles(constant.ContentCreator), api.PlatformUpdate)
	app.Get(path+"/:curriculumGroupId/platforms", authMiddleware.CheckRoles(constant.ContentCreator), api.PlatformList)
	app.Get(path+"/seed-platforms", authMiddleware.CheckRoles(constant.ContentCreator), api.SeedPlatformList)
	app.Post(path+"/platforms/bulk-edit", authMiddleware.CheckRoles(constant.ContentCreator), api.PlatformCaseBulkEdit)

	app.Post(path+"/years", authMiddleware.CheckRoles(constant.ContentCreator), api.YearCreate)
	app.Get(path+"/years/:yearId", authMiddleware.CheckRoles(constant.ContentCreator), api.YearGet)
	app.Patch(path+"/years/:yearId", authMiddleware.CheckRoles(constant.ContentCreator), api.YearUpdate)
	app.Get(path+"/:platformId/years", authMiddleware.CheckRoles(constant.ContentCreator), api.YearList)
	app.Post(path+"/years/bulk-edit", authMiddleware.CheckRoles(constant.ContentCreator), api.YearCaseBulkEdit)
	app.Get(path+"/:platformId/years/download/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.YearDownloadCSV)
	app.Post(path+"/:platformId/years/upload/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.YearUploadCSV)
	app.Get(path+"/seed-years", authMiddleware.CheckRoles(constant.ContentCreator), api.SeedYearList)

	app.Post(path+"/subject-groups", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectGroupCreate)
	app.Get(path+"/subject-groups/:subjectGroupId", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectGroupGet)
	app.Patch(path+"/subject-groups/:subjectGroupId", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectGroupUpdate)
	app.Get(path+"/:yearId/subject-groups", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectGroupList)
	app.Post(path+"/subject-groups/bulk-edit", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectGroupCaseBulkEdit)
	app.Get(path+"/:yearId/subject-groups/download/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectGroupDownloadCSV)
	app.Post(path+"/:yearId/subject-groups/upload/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectGroupUploadCSV)

	app.Post(path+"/subjects", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectCreate)
	app.Get(path+"/subjects/:subjectId", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectGet)
	app.Patch(path+"/subjects/:subjectId", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectUpdate)
	app.Get(path+"/:curriculumGroupId/subjects", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectList)
	app.Post(path+"/subjects/bulk-edit", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectCaseBulkEdit)
	app.Get(path+"/:subjectGroupId/subjects/download/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectDownloadCSV)
	app.Post(path+"/:subjectGroupId/subjects/upload/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectUploadCSV)

	app.Get(path+"/seed-subject-groups", authMiddleware.CheckRoles(constant.ContentCreator), api.SeedSubjectGroupList)

	app.Patch(path+"/tag-groups/:tagGroupId", authMiddleware.CheckRoles(constant.ContentCreator), api.TagGroupUpdate)

	app.Post(path+"/tags", authMiddleware.CheckRoles(constant.ContentCreator), api.TagCreate)
	app.Get(path+"/tags/:tagId", authMiddleware.CheckRoles(constant.ContentCreator), api.TagGet)
	app.Patch(path+"/tags/:tagId", authMiddleware.CheckRoles(constant.ContentCreator), api.TagUpdate)
	app.Get(path+"/:subjectId/tags", authMiddleware.CheckRoles(constant.ContentCreator), api.TagCaseListBySubjectId)

	app.Post(path+"/seed-subject-groups", authMiddleware.CheckRoles(constant.ContentCreator), api.SeedSubjectGroupCreate)
	app.Patch(path+"/seed-subject-groups/:id", authMiddleware.CheckRoles(constant.ContentCreator), api.SeedSubjectGroupUpdate)
	app.Get(path+"/seed-subject-groups/:id", authMiddleware.CheckRoles(constant.ContentCreator), api.SeedSubjectGroupGet)
}
