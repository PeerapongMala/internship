package postgres

import (
	"github.com/jmoiron/sqlx"
	"time"
)

func (postgresRepository *postgresRepository) ClassCreate(tx *sqlx.Tx, userId, name, year string, academicYear, schoolId int) (int, error) {
	query := `
		INSERT INTO "class"."class" (
			"school_id",
			"academic_year",
			"year",
			"name",
			"status",
			"created_at",
			"created_by"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT ("school_id", "academic_year", "year", "name")
		DO UPDATE SET 
    		"id" = "class"."class"."id"
		RETURNING "id";
	`

	classId := 0
	err := tx.QueryRowx(query, schoolId, academicYear, year, name, "enabled", time.Now().UTC(), userId).Scan(&classId)
	if err != nil {
		return 0, err
	}

	return classId, nil
}
