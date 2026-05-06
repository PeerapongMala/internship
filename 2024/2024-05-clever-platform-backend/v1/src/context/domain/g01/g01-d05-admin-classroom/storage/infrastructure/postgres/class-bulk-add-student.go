package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) ClassBulkAddStudent(tx *sqlx.Tx, studentClassMap map[string]constant.ClassEntity) error {
	query := `
		INSERT INTO "school"."class_student" (
			"class_id",
			"student_id"
		)	
		VALUES
	`
	args := []interface{}{}
	placeholders := []string{}

	i := 0
	for studentId, class := range studentClassMap {
		start := i*2 + 1
		placeholders = append(placeholders, fmt.Sprintf(`($%d, $%d)`, start, start+1))
		args = append(args, class.Id, studentId)
		i++
	}
	query += fmt.Sprintf(`%s ON CONFLICT ("student_id", "class_id") DO NOTHING`, strings.Join(placeholders, ","))

	_, err := tx.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
