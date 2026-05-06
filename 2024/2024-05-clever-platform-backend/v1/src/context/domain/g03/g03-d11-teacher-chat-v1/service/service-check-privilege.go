package service

import (
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
)

func (service *serviceStruct) ValidatePrivilege(req *constant.ValidateRequest) (bool, error) {
	var validateFunc func(*constant.ValidateRequest) (bool, error)

	if req.RoomType == "private" {
		return true, nil
	}

	if slices.Contains(req.Role, 6) {
		validateFunc = service.teacherChatStorage.ValidatePrivilegeTeacher
	} else if slices.Contains(req.Role, 7) {
		validateFunc = service.teacherChatStorage.ValidatePrivilegeStudent
	} else {
		return false, nil
	}

	exists, err := validateFunc(req)
	if err != nil {
		return false, err
	}

	return exists, nil
}
