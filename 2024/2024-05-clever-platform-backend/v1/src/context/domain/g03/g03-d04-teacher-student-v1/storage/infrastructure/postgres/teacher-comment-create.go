package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) TeacherCommentCreate(in constant.TeacherCommentCreateDTO) error {

	stm := `
	INSERT INTO level.teacher_note (
		teacher_id,
		student_id,
		level_id,
		text,
		academic_year,
		created_at,
		created_by,
		updated_at,
		updated_by,
		admin_login_as
	) VALUES (
		:teacher_id,
		:student_id,
		:level_id,
		:text,
		:academic_year,
		:created_at,
		:created_by,
		:updated_at,
		:updated_by,
		:admin_login_as
	)
`

	args := map[string]interface{}{
		"teacher_id":     in.TeacherUserId,
		"student_id":     in.StudentUserId,
		"level_id":       in.LevelId,
		"text":           in.Text,
		"academic_year":  in.AcademicYear,
		"created_at":     in.CreatedAt,
		"created_by":     in.CreatedBy,
		"updated_at":     in.CreatedAt,
		"updated_by":     in.CreatedBy,
		"admin_login_as": in.AdminLoginAs,
	}

	if _, err := postgresRepository.Database.NamedExec(stm, args); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
