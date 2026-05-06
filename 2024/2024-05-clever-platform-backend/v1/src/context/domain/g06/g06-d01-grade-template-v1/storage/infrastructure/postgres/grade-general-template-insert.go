package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeGeneralTemplateInsert(tx *sqlx.Tx, entity *constant.GradeGeneralTemplateEntity) (insertId int, err error) {

	query := `
		INSERT INTO grade.general_template (
			"school_id",
			"template_type",
			"template_name",
			"status",
			"active_flag",
			"created_at",
			"created_by",
			"additional_data"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id;
	`

	err = tx.QueryRowx(
		query,
		entity.SchoolId,
		entity.TemplateType,
		entity.TemplateName,
		entity.Status,
		entity.ActiveFlag,
		entity.CreatedAt,
		entity.CreatedBy,
		entity.AdditionalData,
	).Scan(&insertId)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	return insertId, nil
}
