package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-02-teacher-student-group-v1/constant"
	"github.com/pkg/errors"
)

func (p postgresRepository) InsertMemberToStudyGroupByID(items []constant.StudyGroupStudent) error {
	if len(items) == 0 {
		return nil
	}

	query := `
		insert into
			class.study_group_student  (study_group_id, student_id)
		values
			`

	args := []interface{}{}
	valueQuery := generateValueQuery(items, &args)

	query += valueQuery + " on conflict do nothing"

	_, err := p.Database.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}

func generateValueQuery(items []constant.StudyGroupStudent, args *[]interface{}) string {
	values := []string{}
	argIndex := len(*args) + 1

	for _, item := range items {
		values = append(values, fmt.Sprintf("($%d::INTEGER, $%d)", argIndex, argIndex+1))
		*args = append(*args, item.StudyGroupID, item.StudentID)
		argIndex += 2
	}

	return strings.Join(values, ", ")
}
