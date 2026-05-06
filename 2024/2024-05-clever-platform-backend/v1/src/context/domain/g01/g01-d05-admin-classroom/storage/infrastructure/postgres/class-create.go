package postgres

import (
	"github.com/jmoiron/sqlx"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ClassCreate(tx *sqlx.Tx, class *constant.ClassEntity) (*constant.ClassEntity, error) {
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
		return nil, err
	}

	return &classEntity, nil
}
