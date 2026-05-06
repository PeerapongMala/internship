package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) TeacherItemGroupCreate(tx *sqlx.Tx, teacherItemGroups []constant.TeacherItemGroupEntity) error {
	if len(teacherItemGroups) <= 0 {
		return nil
	}

	args := []interface{}{}
	query := []string{}
	for i, teacherItemGroup := range teacherItemGroups {
		query = append(query, fmt.Sprintf(` ($%d, $%d)`, i*2+1, i*2+2))
		args = append(args, teacherItemGroup.SubjectId, teacherItemGroup.TeacherId)
	}

	insertQuery := fmt.Sprintf(`
		INSERT INTO "teacher_item"."teacher_item_group" (
			"subject_id",
			"teacher_id"
		)
		VALUES %s
		ON CONFLICT ("subject_id", "teacher_id") DO NOTHING
	`, strings.Join(query, ","))
	_, err := tx.Exec(insertQuery, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
