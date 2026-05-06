package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) DocumentTemplateGet(id int) (*constant.GradeDocumentTemplate, error) {
	query := `
		SELECT
			dt.*,
			(SELECT "sub_u"."first_name" FROM "user"."user" sub_u WHERE sub_u."id" = updated_by LIMIT 1) AS updated_by
		FROM grade.document_template dt
		WHERE "id" = $1
	`

	entity := constant.GradeDocumentTemplate{}
	err := postgresRepository.Database.QueryRowx(query, id).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
