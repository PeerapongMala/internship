package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
	"log"
	"mime/multipart"
	"net/http"
	"slices"
	"time"
)

type TeacherRewardCreateRequest struct {
	RewardName    string                `form:"reward_name" validate:"required"`
	RewardAmount  int                   `form:"reward_amount" validate:"required"`
	Description   string                `form:"description"`
	StudentIds    []string              `form:"student_ids"`
	StudyGroupIds []int                 `form:"study_group_ids"`
	ClassIds      []int                 `form:"class_ids"`
	Image         *multipart.FileHeader `form:"image"`
	ImageKey      string                `form:"image_key"`
	SubjectId     int                   `form:"subject_id" validate:"required"`
	AdminLoginAs  *string               `form:"admin_login_as"`
}

type TeacherRewardCreateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

func (api *APIStruct) TeacherRewardCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherRewardCreateRequest{}, helper.ParseOptions{Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	image, err := context.FormFile("image")
	if err != nil && err != fasthttp.ErrMissingFile {
		return helper.RespondHttpError(context, err)
	}
	request.Image = image

	err = api.Service.TeacherRewardCreate(&TeacherRewardCreateInput{
		TeacherId:                  subjectId,
		TeacherRewardCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusCreated,
		Message:    "Reward send",
	})
}

type TeacherRewardCreateInput struct {
	TeacherId string
	*TeacherRewardCreateRequest
}

func (service *serviceStruct) TeacherRewardCreate(in *TeacherRewardCreateInput) error {
	tx, err := service.teacherRewardStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var key *string
	isNew := false
	if in.Image != nil {
		tmp := uuid.NewString()
		key = &tmp
		isNew = true
	} else {
		key = &in.ImageKey
	}

	itemEntity := constant.ItemEntity{
		Type:         "coupon",
		Name:         in.RewardName,
		Description:  in.Description,
		ImageUrl:     key,
		Status:       "enabled",
		CreatedAt:    time.Now().UTC(),
		CreatedBy:    in.TeacherId,
		UpdatedAt:    nil,
		UpdatedBy:    nil,
		AdminLoginAs: in.AdminLoginAs,
	}
	itemId, err := service.teacherRewardStorage.ItemCreate(tx, itemEntity)
	if err != nil {
		return err
	}

	if in.StudyGroupIds != nil {
		studentIds, err := service.teacherRewardStorage.StudyGroupStudentGet(in.StudyGroupIds)
		if err != nil {
			return err
		}
		in.StudentIds = append(in.StudentIds, studentIds...)
	}

	if in.ClassIds != nil {
		studentIds, err := service.teacherRewardStorage.ClassStudentGet(in.StudyGroupIds)
		if err != nil {
			return err
		}
		in.StudentIds = append(in.StudentIds, studentIds...)
	}

	slices.Sort(in.StudentIds)
	in.StudentIds = slices.Compact(in.StudentIds)
	for _, studentId := range in.StudentIds {
		classId, err := service.teacherRewardStorage.GetClassByStudentId(studentId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}

		CreateRequest := constant.TeacherRewardCreate{
			SubjectId:    &in.SubjectId,
			TeacherId:    in.TeacherId,
			StudentId:    studentId,
			ClassId:      classId,
			ItemId:       itemId,
			Amount:       in.RewardAmount,
			Status:       "send",
			CreatedBy:    in.TeacherId,
			AdminLoginAs: in.AdminLoginAs,
		}
		err = service.teacherRewardStorage.TeacherRewardCreate(tx, CreateRequest)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	if key != nil && isNew {
		err = service.cloudStorage.ObjectCreate(in.Image, *key, constant2.Image)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
