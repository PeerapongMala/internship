package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	g01D07Constant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"slices"
)

// ==================== Request ==========================

type AuthCaseAdminLoginAsRequest struct {
	TargetUserId string `json:"target_user_id"`
}

// ==================== Request ==========================

type AuthCaseAdminLoginAsResponse struct {
	StatusCode int                `json:"status_code"`
	Data       []AdminLoginAsData `json:"data"`
	Message    string             `json:"message"`
}

type AdminLoginAsData struct {
	Id                    string             `json:"id"`
	SchoolId              *int               `json:"school_id"`
	SchoolName            *string            `json:"school_name"`
	SchoolCode            *string            `json:"school_code"`
	SchoolImageUrl        *string            `json:"school_image_url"`
	Title                 string             `json:"title"`
	FirstName             string             `json:"first_name"`
	LastName              string             `json:"last_name"`
	ImageUrl              *string            `json:"image_url"`
	TargetUserAccessToken string             `json:"target_user_access_token"`
	AdminUserId           string             `json:"admin_user_id"`
	Roles                 []int              `json:"roles"`
	TeacherRoles          []int              `json:"teacher_roles"`
	IsSubjectTeacher      bool               `json:"is_subject_teacher"`
	Subject               []constant.Subject `json:"subject"`
	AcademicYear          *int               `json:"academic_year"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AuthCaseAdminLoginAs(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseAdminLoginAsRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	authCaseAdminLoginAsOutput, err := api.Service.AuthCaseAdminLoginAs(&AuthCaseAdminLoginAsInput{
		AuthCaseAdminLoginAsRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(AuthCaseAdminLoginAsResponse{
		StatusCode: http.StatusOK,
		Data: []AdminLoginAsData{{
			Id:                    authCaseAdminLoginAsOutput.Id,
			SchoolId:              authCaseAdminLoginAsOutput.SchoolId,
			SchoolName:            authCaseAdminLoginAsOutput.SchoolName,
			SchoolCode:            authCaseAdminLoginAsOutput.SchoolCode,
			SchoolImageUrl:        authCaseAdminLoginAsOutput.SchoolImageUrl,
			Title:                 authCaseAdminLoginAsOutput.Title,
			FirstName:             authCaseAdminLoginAsOutput.FirstName,
			LastName:              authCaseAdminLoginAsOutput.LastName,
			ImageUrl:              authCaseAdminLoginAsOutput.ImageUrl,
			TargetUserAccessToken: *authCaseAdminLoginAsOutput.AccessToken,
			AdminUserId:           subjectId,
			Roles:                 authCaseAdminLoginAsOutput.Roles,
			TeacherRoles:          authCaseAdminLoginAsOutput.TeacherRoles,
			IsSubjectTeacher:      authCaseAdminLoginAsOutput.IsSubjectTeacher,
			Subject:               authCaseAdminLoginAsOutput.Subject,
			AcademicYear:          authCaseAdminLoginAsOutput.AcademicYear,
		}},
		Message: "Login as admin successfully",
	})
}

// ==================== Service ==========================

type AuthCaseAdminLoginAsInput struct {
	*AuthCaseAdminLoginAsRequest
}

type AuthCaseAdminLoginAsOutput struct {
	Id               string
	Title            string
	FirstName        string
	LastName         string
	ImageUrl         *string
	AccessToken      *string
	Roles            []int
	TeacherRoles     []int
	SchoolId         *int
	SchoolName       *string
	SchoolShortName  *string
	SchoolCode       *string
	SchoolImageUrl   *string
	IsSubjectTeacher bool
	Subject          []constant.Subject
	AcademicYear     *int
}

func (service *serviceStruct) AuthCaseAdminLoginAs(in *AuthCaseAdminLoginAsInput) (*AuthCaseAdminLoginAsOutput, error) {
	user, err := service.adminSchoolStorage.UserGet(in.TargetUserId)
	if err != nil {
		return nil, err
	}

	accessToken, err := helper.GenerateJwt(user.Id)
	if err != nil {
		return nil, err
	}

	roles, err := service.adminSchoolStorage.UserCaseGetUserRole(user.Id)
	if err != nil {
		return nil, err
	}

	var academicYear *int
	teacherRoles := []int{}
	isTeacher := slices.Contains(roles, int(g01D07Constant.Teacher))
	if isTeacher {
		if user.ScId != nil {
			academicYear, err = service.adminSchoolStorage.CurrentAcademicYearGet(*user.ScId)
			if err != nil {
				return nil, err
			}
		}

		teacherRoles, err = service.adminSchoolStorage.TeacherAccessRoleGetByUserID(user.Id)
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

	var isSubjectTeacher bool
	subjects, err := service.adminSchoolStorage.SubjectTeacherGet(user.Id)
	if err != nil {
		return nil, err
	}
	if len(subjects) > 0 {
		isSubjectTeacher = true
	}

	return &AuthCaseAdminLoginAsOutput{
		Id:               user.Id,
		SchoolId:         user.ScId,
		SchoolName:       user.SchoolName,
		SchoolCode:       user.SchoolCode,
		SchoolImageUrl:   user.SchoolImageUrl,
		Title:            user.Title,
		FirstName:        user.FirstName,
		LastName:         user.LastName,
		ImageUrl:         user.ImageUrl,
		AccessToken:      accessToken,
		Roles:            roles,
		TeacherRoles:     teacherRoles,
		IsSubjectTeacher: isSubjectTeacher,
		Subject:          subjects,
		AcademicYear:     academicYear,
	}, nil
}
