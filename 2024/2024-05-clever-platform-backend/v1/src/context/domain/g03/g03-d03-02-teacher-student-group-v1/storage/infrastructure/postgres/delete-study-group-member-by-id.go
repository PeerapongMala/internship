package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-02-teacher-student-group-v1/constant"
	"github.com/pkg/errors"
)

func (p postgresRepository) DeleteStudyGroupMemberByID(items []constant.StudyGroupStudent) error {
	if len(items) == 0 {
		return nil
	}

	tx, err := p.Database.Begin()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	args := []interface{}{}
	valueQuery := generateDeleteValueQuery(items, &args)

	query := `
		DELETE FROM class.study_group_student AS sgs
		USING (
			VALUES ` + valueQuery + `
		) v(study_group_id, student_id)
		WHERE sgs.study_group_id = v.study_group_id
		AND sgs.student_id = v.student_id;
	`

	_, err = tx.Exec(query, args...)
	if err != nil {
		tx.Rollback()
		log.Printf("%+v", errors.WithStack(err))
		return fmt.Errorf("delete failed: %w", err)
	}

	if err = tx.Commit(); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func generateDeleteValueQuery(items []constant.StudyGroupStudent, args *[]interface{}) string {
	values := []string{}
	argIndex := len(*args) + 1

	for _, item := range items {
		values = append(values, fmt.Sprintf("($%d::INTEGER, $%d)", argIndex, argIndex+1))
		*args = append(*args, item.StudyGroupID, item.StudentID)
		argIndex += 2
	}

	return strings.Join(values, ", ")
}
