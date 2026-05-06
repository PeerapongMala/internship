package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ClassCreateTx(tx *sqlx.Tx, class *constant.ClassEntity) (*constant.ClassEntity, error) {
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

	var queryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		queryMethod = tx.QueryRowx
	} else {
		queryMethod = postgresRepository.Database.QueryRowx
	}

	classEntity := constant.ClassEntity{}
	err := queryMethod(
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
