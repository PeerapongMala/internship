package service

import (
	"fmt"
	"log"
	"net/http"

	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
)

func (api *APIStruct) AddTeacherAnnouncement(context *fiber.Ctx) error {
	var body constant.TeacherAnnounceCreate

	if err := context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "bad request",
		})
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	RolesCheck := constant.CheckRoleRequest{
		Roles:     roles,
		SubjectId: subjectId,
	}
	ImageFile, err := context.FormFile("announcement_image")
	if err != nil && err != fasthttp.ErrMissingFile {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	body.ImageFile = ImageFile
	err = api.Service.AnnouncementCreate(body, RolesCheck)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusCreated,
		Message:    "Announcement Created",
	})
}
func (service *serviceStruct) AnnouncementCreate(req constant.TeacherAnnounceCreate, Role constant.CheckRoleRequest) error {
	SchoolId, err := service.TeacherannounceStorage.GetSchoolByUserId(Role.SubjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	req.SchoolId = SchoolId
	if SchoolId != req.SchoolId {
		msg := fmt.Sprintf("User not a Teacher in school id %d", req.SchoolId)
		return helper.NewHttpError(http.StatusForbidden, &msg)
	}
	var key *string
	if req.ImageFile != nil {
		imageKey := uuid.NewString()
		key = &imageKey
		req.Image = key
	}

	if req.ImageFile != nil {
		err := service.cloudStorage.ObjectCreate(req.ImageFile, *key, cloudStorageConstant.Image)
		if err != nil {
			return err
		}
	}
	for _, role := range Role.Roles {
		if role == int(userConstant.Admin) {
			req.AdminLoginAs = &Role.SubjectId
			break
		}
	}
	req.CreatedBy = Role.SubjectId
	err = service.TeacherannounceStorage.AnnouncementCreate(req)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
