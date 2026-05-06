package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) DocumentTemplateCreate(tx *sqlx.Tx, entity *constant.GradeDocumentTemplate) (int, error) {
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
			name
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id;
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
	).Scan(&id)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}
	return id, nil
}
