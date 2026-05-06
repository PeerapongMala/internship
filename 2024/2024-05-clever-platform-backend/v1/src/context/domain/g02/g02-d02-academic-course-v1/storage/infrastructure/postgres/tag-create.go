package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TagCreate(tag *constant.TagEntity) (*constant.TagEntity, error) {
	query := `
		INSERT INTO "subject"."tag" (
			"tag_group_id",
			"name",
			"status",
			"created_at",
			"created_by",
			"admin_login_as"	
		)	
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING *
	`
	tagEntity := constant.TagEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		tag.TagGroupId,
		tag.Name,
		tag.Status,
		tag.CreatedAt,
		tag.CreatedBy,
		tag.AdminLoginAs,
	).StructScan(&tagEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &tagEntity, nil
}
