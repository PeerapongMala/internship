package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) DocumentTemplateDeleteImage(id int, deleteLogoImage, deleteBackgroundImage bool) error {
	baseQuery := `
		UPDATE grade.document_template SET
	`
	valid := false

	if deleteLogoImage {
		baseQuery += ` logo_image = NULL`
		valid = true
	}
	if deleteBackgroundImage {
		if valid {
			baseQuery += ","
		}
		baseQuery += ` background_image = NULL`
		valid = true
	}
	baseQuery += ` WHERE id = $1`

	if !valid {
		return nil
	}

	_, err := postgresRepository.Database.Exec(baseQuery, id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
