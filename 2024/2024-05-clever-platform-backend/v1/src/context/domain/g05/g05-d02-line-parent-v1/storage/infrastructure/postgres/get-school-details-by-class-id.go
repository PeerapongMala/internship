package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetSchoolDetailsByClassId(classId int) (*constant.SchoolDetails, error) {
	query := `
		SELECT
			"s"."id",
			"s"."code",
			"s"."name",
			"s"."image_url"
		FROM "class"."class" c
		INNER JOIN "school"."school" s ON "c"."school_id" = "s"."id"
		WHERE "c"."id" = $1
	`
	var schoolDetails constant.SchoolDetails
	err := postgresRepository.Database.QueryRowx(query, classId).StructScan(&schoolDetails)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &schoolDetails, nil
}
