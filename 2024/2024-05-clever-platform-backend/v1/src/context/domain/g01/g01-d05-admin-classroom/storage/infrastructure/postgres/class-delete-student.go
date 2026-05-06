package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) ClassDeleteStudent(tx *sqlx.Tx, schoolId int, studentClassMap map[string]constant.ClassEntity) error {
	tmpQuery := `
		CREATE TEMPORARY TABLE "tmp" (
		    student_id VARCHAR,
		    academic_year INT
		) ON COMMIT DROP;
	`

	insertQuery := `
		INSERT INTO "tmp" (
			student_id,
			academic_year
		) 
		VALUES
	`
	args := []interface{}{schoolId}
	placeholders := []string{}

	i := 0
	for studentId, class := range studentClassMap {
		start := i*2 + 1
		placeholders = append(placeholders, fmt.Sprintf(`($%d, $%d)`, start, start+1))
		args = append(args, studentId, class.AcademicYear)
		i++
	}
	insertQuery += strings.Join(placeholders, ",")

	deleteQuery := `
        DELETE FROM "school"."class_student" 
        WHERE (student_id, class_id) IN (
            SELECT 
                "cs"."student_id",
                "c"."id"
            FROM "tmp" t
            INNER JOIN "class"."class" c 
                ON "c"."school_id" = $1 
                AND "c"."academic_year" = "t"."academic_year"
            INNER JOIN "school"."class_student" cs 
                ON "t"."student_id" = "cs"."student_id" 
                AND "c"."id" = "cs"."class_id"
        );
    `

	_, err := tx.Exec(tmpQuery)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	if len(placeholders) > 0 {
		_, err = tx.Exec(insertQuery, args[1:]...)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	_, err = tx.Exec(deleteQuery, schoolId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
