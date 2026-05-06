package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentCaseGetByClass(tx *sqlx.Tx, academicYear int, year string, name string) ([]constant.StudentEntity, error) {

	query := `
		SELECT 
		    u.title,
		    u.first_name,
			u.last_name,
    		s.user_id,
    		s.school_id,
    		s.student_id,
    		s.year,
    		s.birth_date,
    		s.nationality,
    		s.ethnicity,
    		s.religion,
    		s.father_title,
    		s.father_first_name,
    		s.father_last_name,
    		s.mother_title,
    		s.mother_first_name,
    		s.mother_last_name,
    		s.parent_relationship,
    		s.parent_title,
    		s.parent_first_name,
    		s.parent_last_name,
    		s.house_number,
    		s.moo,
    		s.district,
    		s.sub_district,
    		s.province,
    		s.post_code,
    		s.parent_marital_status
		FROM "class"."class" c
		INNER JOIN "school"."class_student" cs ON "c"."id" = "cs"."class_id"
		INNER JOIN "user"."student" s ON "cs"."student_id" = "s"."user_id"
		INNER JOIN "user"."user" u ON "s"."user_id" = "u"."id"
		WHERE	
			"c"."academic_year" = $1
			AND "c"."year" = $2
			AND "c"."name" = $3
			AND "u"."status" = 'enabled'
	`

	students := []constant.StudentEntity{}
	err := tx.Select(&students, query, academicYear, year, name)
	if err != nil {
		log.Println("%+v", errors.WithStack(err))
		return nil, err
	}

	return students, nil
}
