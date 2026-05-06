package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ClassGet(classId int) (*constant.ClassEntity, error) {
	query := `
		SELECT
			"id",
			"school_id",
			"academic_year",
			"year",
			"name",
			"status",
			"created_at",
			"created_by",
			"updated_at",
			"updated_by"
		FROM "class"."class"
		WHERE "id" = $1
	`
	classEntity := constant.ClassEntity{}
	err := postgresRepository.Database.QueryRowx(query, classId).StructScan(&classEntity)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &classEntity, nil
}
