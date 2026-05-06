package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SchoolAddressGetByFormId(formId int) (*string, *string, error) {
	query := `
		SELECT
			"sc"."address",
			"sc"."province"
		FROM "grade"."evaluation_form" ef
		INNER JOIN "school"."school" sc ON "ef"."school_id" = "sc"."id"
		WHERE "ef"."id" = $1
	`
	var address, province *string
	err := postgresRepository.Database.QueryRowx(query, formId).Scan(&address, &province)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, nil, err
	}

	return address, province, nil
}
