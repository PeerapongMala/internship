package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/pkg/errors"
)

// TeacherCommentUpdate implements storageRepository.RepositoryTeacherStudent.
func (postgresRepository *postgresTeacherStudentRepository) TeacherCommentUpdate(in constant.TeacherCommentUpdate) error {

	stm := `
	UPDATE level.teacher_note
	SET
		text = :text,
		updated_at = :updated_at,
		updated_by = :updated_by,
		admin_login_as = :admin_login_as
	WHERE id = :id;
	`
	args := map[string]interface{}{
		"id":             in.CommentId,
		"text":           in.Text,
		"updated_at":     in.UpdatedAt,
		"updated_by":     in.UpdatedBy,
		"admin_login_as": in.AdminLoginAs,
	}

	if _, err := postgresRepository.Database.NamedExec(stm, args); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
