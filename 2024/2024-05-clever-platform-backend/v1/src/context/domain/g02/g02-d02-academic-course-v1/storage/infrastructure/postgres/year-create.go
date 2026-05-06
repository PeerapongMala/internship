package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) YearCreate(tx *sqlx.Tx, year *constant.YearEntity) (*constant.YearEntity, error) {
	query := `
		INSERT INTO "curriculum_group"."year" (
			"curriculum_group_id",
			"platform_id",
			"seed_year_id",
			"status",
			"created_at",
			"created_by",
			"admin_login_as"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING *
	`
	yearEntity := constant.YearEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		year.CurriculumGroupId,
		year.PlatformId,
		year.SeedYearId,
		year.Status,
		year.CreatedAt,
		year.CreatedBy,
		year.AdminLoginAs,
	).StructScan(&yearEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &yearEntity, nil
}
