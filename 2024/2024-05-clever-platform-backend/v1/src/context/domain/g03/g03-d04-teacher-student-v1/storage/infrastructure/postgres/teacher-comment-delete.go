package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) TeacherCommentDelete(commentId int) error {
	stm := `
	DELETE FROM level.teacher_note WHERE id = $1
	`

	if _, err := postgresRepository.Database.Exec(stm, commentId); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
