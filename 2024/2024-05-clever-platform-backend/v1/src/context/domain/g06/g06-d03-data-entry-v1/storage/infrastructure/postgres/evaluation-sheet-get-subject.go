package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) EvaluationSheetGetSubject(sheetId int) (*constant.SheetSubject, error) {
	query := `
		SELECT
			"ts"."subject_name",
			"ef"."year",
			"ef"."school_room" AS class_name
		FROM "grade"."evaluation_sheet" es
		INNER JOIN "grade"."evaluation_form_subject" efsi ON "es"."evaluation_form_subject_id" = "efsi"."id"
		INNER JOIN "grade"."template_subject" ts ON "efsi"."template_subject_id" = "ts"."id"
		INNER JOIN "grade"."evaluation_form" ef ON "es"."form_id" = "ef"."id"
		WHERE "es"."id" = $1 
	`
	subject := constant.SheetSubject{}
	err := postgresRepository.Database.QueryRowx(query, sheetId).StructScan(&subject)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &subject, nil
}
