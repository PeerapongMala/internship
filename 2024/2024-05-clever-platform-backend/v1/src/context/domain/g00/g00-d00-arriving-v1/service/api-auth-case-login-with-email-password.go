package service

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-arriving-v1/constant"
	g01D07Constant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type AuthCaseLoginWithEmailPasswordRequest struct {
	Email    string `json:"email" validate:"required"`
	Password string `json:"password" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseLoginWithEmailPasswordResponse struct {
	StatusCode int         `json:"status_code"`
	Data       []LoginData `json:"data"`
	Message    string      `json:"message"`
}

type LoginData struct {
	Id               string             `json:"id"`
	Title            string             `json:"title"`
	FirstName        string             `json:"first_name"`
	LastName         string             `json:"last_name"`
	SchoolId         *string            `json:"school_id"`
	SchoolCode       *string            `json:"school_code"`
	SchoolName       *string            `json:"school_name"`
	SchoolImageUrl   *string            `json:"school_image_url"`
	ImageUrl         *string            `json:"image_url"`
	AccessToken      string             `json:"access_token"`
	Roles            []int              `json:"roles"`
	TeacherRoles     []int              `json:"teacher_roles"`
	IsSubjectTeacher bool               `json:"is_subject_teacher"`
	Subject          []constant.Subject `json:"subject"`
	AcademicYear     *int               `json:"academic_year"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AuthCaseLoginWithEmailPassword(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseLoginWithEmailPasswordRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	authCaseLoginWithEmailPasswordOutput, err := api.Service.AuthCaseLoginWithEmailPassword(&AuthCaseLoginWithEmailPasswordInput{
		Email:    request.Email,
		Password: request.Password,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AuthCaseLoginWithEmailPasswordResponse{
		StatusCode: http.StatusOK,
		Data: []LoginData{{
			Id:               authCaseLoginWithEmailPasswordOutput.Id,
			Title:            authCaseLoginWithEmailPasswordOutput.Title,
			FirstName:        authCaseLoginWithEmailPasswordOutput.FirstName,
			LastName:         authCaseLoginWithEmailPasswordOutput.LastName,
			SchoolId:         authCaseLoginWithEmailPasswordOutput.SchoolId,
			SchoolName:       authCaseLoginWithEmailPasswordOutput.SchoolName,
			SchoolCode:       authCaseLoginWithEmailPasswordOutput.SchoolCode,
			SchoolImageUrl:   authCaseLoginWithEmailPasswordOutput.SchoolImageUrl,
			ImageUrl:         authCaseLoginWithEmailPasswordOutput.ImageUrl,
			AccessToken:      *authCaseLoginWithEmailPasswordOutput.AccessToken,
			Roles:            authCaseLoginWithEmailPasswordOutput.Roles,
			TeacherRoles:     authCaseLoginWithEmailPasswordOutput.TeacherRoles,
			IsSubjectTeacher: authCaseLoginWithEmailPasswordOutput.IsSubjectTeacher,
			Subject:          authCaseLoginWithEmailPasswordOutput.Subjects,
			AcademicYear:     authCaseLoginWithEmailPasswordOutput.AcademicYear,
		}},
		Message: "Login successfully",
	})
}

// ==================== Service ==========================

type AuthCaseLoginWithEmailPasswordInput struct {
	Email    string
	Password string
}

type AuthCaseLoginWithEmailPasswordOutput struct {
	Id               string
	Title            string
	FirstName        string
	LastName         string
	SchoolId         *string
	SchoolName       *string
	SchoolCode       *string
	SchoolImageUrl   *string
	ImageUrl         *string
	AccessToken      *string
	Roles            []int
	TeacherRoles     []int
	IsSubjectTeacher bool
	Subjects         []constant.Subject
	AcademicYear     *int
}

func (service *serviceStruct) AuthCaseLoginWithEmailPassword(in *AuthCaseLoginWithEmailPasswordInput) (*AuthCaseLoginWithEmailPasswordOutput, error) {
	user, err := service.arrivingStorage.UserCaseGetByEmail(in.Email)
	if err != nil {
		return nil, err
	}

	if user.Status != constant.Enabled {
		msg := "Account isn't enabled"
		return nil, helper.NewHttpError(http.StatusUnauthorized, &msg)
	}

	authEmailPassword, err := service.arrivingStorage.AuthEmailPasswordCaseGetByUserId(user.Id)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	if err == sql.ErrNoRows {
		return nil, helper.NewHttpError(http.StatusUnauthorized, nil)
	}

	isMatched := helper.ValidatePassword(authEmailPassword.PasswordHash, in.Password)

	if !isMatched {
		return nil, helper.NewHttpError(http.StatusUnauthorized, nil)
	}

	accessToken, err := helper.GenerateJwt(user.Id)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	_, err = service.arrivingStorage.UserUpdate(nil, &constant.UserEntity{
		Id:        user.Id,
		LastLogin: &now})
	if err != nil {
		return nil, err
	}

	roles, err := service.arrivingStorage.UserRoleCaseGetByUserId(user.Id)
	if err != nil {
		return nil, err
	}

	var isSubjectTeacher bool
	subjects, err := service.arrivingStorage.SubjectTeacherGet(user.Id)
	if err != nil {
		return nil, err
	}
	if len(subjects) > 0 {
		isSubjectTeacher = true
	}

	var academicYear *int
	teacherRoles := []int{}
	isTeacher := slices.Contains(roles, int(g01D07Constant.Teacher))
	if isTeacher {
		var schoolId int
		if user.SchoolId != nil {
			schoolId, _ = strconv.Atoi(*user.SchoolId)
		}
		academicYear, err = service.arrivingStorage.CurrentAcademicYearGet(schoolId)
		if err != nil {
			return nil, err
		}

		teacherRoles, err = service.arrivingStorage.TeacherAccessRoleGetByUserID(user.Id)
		if err != nil {
			return nil, err
		}
	}

	if user.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*user.ImageUrl)
		if err != nil {
			return nil, err
		}
		user.ImageUrl = url
	}

	if user.SchoolImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*user.SchoolImageUrl)
		if err != nil {
			return nil, err
		}
		user.SchoolImageUrl = url
	}

	return &AuthCaseLoginWithEmailPasswordOutput{
		Id:               user.Id,
		Title:            user.Title,
		FirstName:        user.FirstName,
		LastName:         user.LastName,
		SchoolId:         user.SchoolId,
		SchoolCode:       user.SchoolCode,
		SchoolImageUrl:   user.SchoolImageUrl,
		SchoolName:       user.SchoolName,
		ImageUrl:         user.ImageUrl,
		AccessToken:      accessToken,
		Roles:            roles,
		TeacherRoles:     teacherRoles,
		IsSubjectTeacher: isSubjectTeacher,
		Subjects:         subjects,
		AcademicYear:     academicYear,
	}, nil
}
