package constant

import (
	"net/http"

	teacherHomeworkConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
)

type StatusResponse teacherHomeworkConstant.StatusResponse

func NewSuccessReponse() StatusResponse {
	return StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
	}
}
