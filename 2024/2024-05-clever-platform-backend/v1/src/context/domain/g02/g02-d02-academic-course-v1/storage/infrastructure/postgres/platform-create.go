package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) PlatformCreate(platform *constant.PlatformEntity) (*constant.PlatformEntity, error) {
	query := `
		INSERT INTO "curriculum_group"."platform" (
			"curriculum_group_id",
			"seed_platform_id",	
			"status",
		    "created_at",
			"created_by",
			"admin_login_as"
		)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING *
	`

	platformEntity := constant.PlatformEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		platform.CurriculumGroupId,
		platform.SeedPlatformId,
		platform.Status,
		platform.CreatedAt,
		platform.CreatedBy,
		platform.AdminLoginAs,
	).StructScan(&platformEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &platformEntity, nil
}
