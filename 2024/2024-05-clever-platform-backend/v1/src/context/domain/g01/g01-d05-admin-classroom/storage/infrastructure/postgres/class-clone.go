package postgres

import (
	"github.com/jmoiron/sqlx"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ClassClone(tx *sqlx.Tx, sourceClassId int, class *constant.ClassEntity) (*constant.ClassEntity, error) {
	query := `
		INSERT INTO "class"."class" (
			"school_id",
			"academic_year",
			"year",
			"name",
			"status",
			"created_at",
			"created_by",
			"updated_at",
			"updated_by"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING *;
	`
	classEntity := constant.ClassEntity{}
	err := tx.QueryRowx(
		query,
		class.SchoolId,
		class.AcademicYear,
		class.Year,
		class.Name,
		class.Status,
		class.CreatedAt,
		class.CreatedBy,
		class.UpdatedAt,
		class.UpdatedBy,
	).StructScan(&classEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, errors.Wrap(err, "insert new class")
	}

	_, err = tx.Exec(`
			INSERT INTO "school"."class_teacher" (class_id, teacher_id) 
				SELECT $2, ct.teacher_id 
				FROM school.class_teacher ct 
				WHERE ct.class_id = $1`,
		sourceClassId,
		classEntity.Id,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, errors.Wrap(err, "insert class teacher")
	}

	_, err = tx.Exec(`
			INSERT INTO "school"."class_student" (class_id, student_id) 
				SELECT $2, cs.student_id 
				FROM school.class_student cs 
				WHERE cs.class_id = $1`,
		sourceClassId,
		classEntity.Id,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, errors.Wrap(err, "insert class student")
	}

	return &classEntity, nil
}
