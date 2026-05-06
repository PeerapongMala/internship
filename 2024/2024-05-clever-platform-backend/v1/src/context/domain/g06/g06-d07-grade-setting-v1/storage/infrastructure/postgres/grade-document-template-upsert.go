package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) DocumentTemplateUpsert(tx *sqlx.Tx, entity *constant.GradeDocumentTemplate) (int, error) {
	query := `
		INSERT INTO grade.document_template (
			school_id, 
			format_id, 
			logo_image, 
			background_image, 
			colour_setting, 
			created_at, 
			created_by, 
			updated_at, 
			updated_by,
			is_default,
			name,
			id
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		ON CONFLICT (id) DO UPDATE
		SET
 			logo_image = COALESCE(EXCLUDED.logo_image, grade.document_template.logo_image),
		    background_image = COALESCE(EXCLUDED.background_image, grade.document_template.background_image),
		    colour_setting = COALESCE(EXCLUDED.colour_setting, grade.document_template.colour_setting),
		    is_default = COALESCE(EXCLUDED.is_default, grade.document_template.is_default),
		    format_id = COALESCE(EXCLUDED.format_id, grade.document_template.format_id),
		    "name" = COALESCE(EXCLUDED.name, grade.document_template.name),
		    updated_at = EXCLUDED.updated_at,
		    updated_by = EXCLUDED.updated_by
		RETURNING id
	`
	var id int
	err := tx.QueryRowx(
		query,
		entity.SchoolID,
		entity.FormatID,
		entity.LogoImage,
		entity.BackgroundImage,
		entity.ColourSetting,
		entity.CreatedAt,
		entity.CreatedBy,
		entity.UpdatedAt,
		entity.UpdatedBy,
		entity.IsDefault,
		entity.Name,
		entity.Id,
	).Scan(&id)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return id, err
	}
	return id, nil
}
