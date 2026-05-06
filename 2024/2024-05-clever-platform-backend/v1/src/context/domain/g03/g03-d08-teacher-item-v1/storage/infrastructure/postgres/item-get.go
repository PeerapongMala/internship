package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ItemGet(itemId int) (*constant.ItemEntity, error) {
	query := `
		SELECT
			"i"."id",
			"i"."template_item_id",
			"i"."image_url",
			"b"."template_path",
			"i2"."name",
			"b"."badge_description",
			"i"."name",	
			"i"."type",
			"i"."description",
			"i"."updated_at",
			"u"."first_name" AS "updated_by",
			"i"."status",
			"st"."school_id"
		FROM
			"item"."item" i
		LEFT JOIN
			"user"."user" u
			ON "i"."updated_by" = "u"."id"
		LEFT JOIN
			"item"."badge" b
			ON "i"."id" = "b"."item_id"
		LEFT JOIN
			"item"."item" i2
			ON "i"."template_item_id" = "i2"."id"
		LEFT JOIN "teacher_item"."teacher_item_group" tig
			ON "i"."teacher_item_group_id" = "tig"."id"	
		LEFT JOIN "school"."school_teacher" st 
			ON "tig"."teacher_id" = "st"."user_id"
		WHERE
			"i"."id" = $1
	`
	itemEntity := constant.ItemEntity{}
	err := postgresRepository.Database.QueryRowx(query, itemId).StructScan(&itemEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &itemEntity, nil
}
