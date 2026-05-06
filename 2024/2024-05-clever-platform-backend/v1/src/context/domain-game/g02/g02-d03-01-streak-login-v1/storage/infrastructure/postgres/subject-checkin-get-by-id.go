package postgres

import (
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) GetSubjectCheckin(studentId string, subjectId int) (*constant.SubjectCheckinEntity, error) {
	checkin := constant.SubjectCheckinEntity{}
	err := postgresRepository.Database.Get(&checkin, `SELECT * FROM "streak_login"."subject_checkin" WHERE student_id = $1 AND subject_id = $2`, studentId, subjectId)
	if err != nil {
		// if err == sql.ErrNoRows {
		// 	return nil, nil
		// }
		return nil, err // ข้อผิดพลาดอื่น ๆ ที่ไม่ใช่ ErrNoRows
	}

	missLoginDays := strings.Split(helper.Deref(checkin.MissLoginDay), ",")
	missLoginDaysSlice := []int{}
	for _, dayString := range missLoginDays {
		day, _ := strconv.Atoi(dayString)
		if day != 0 {
			missLoginDaysSlice = append(missLoginDaysSlice, day)
		}
	}
	checkin.MissLoginDaySlice = missLoginDaysSlice 	

	return &checkin, nil
}

func (postgresRepository *postgresRepository) GetSubjectCheckinByAdmin(studentId string, subjectId int, adminLoginAs *string) (*constant.SubjectCheckinEntity, error) {
	checkin := constant.SubjectCheckinEntity{}
	err := postgresRepository.Database.Get(&checkin, `SELECT * FROM "streak_login"."subject_checkin" WHERE student_id = $1 AND subject_id = $2 AND admin_login_as = $3`, studentId, subjectId, adminLoginAs)
	if err != nil {
		// if err == sql.ErrNoRows {
		// 	return nil, nil
		// }
		return nil, err // ข้อผิดพลาดอื่น ๆ ที่ไม่ใช่ ErrNoRows
	}

	return &checkin, nil
}
