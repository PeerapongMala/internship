package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeSubjectInsert(tx *sqlx.Tx, entity *constant.SubjectEntity) (insertId int, err error) {

	query := `
		INSERT INTO grade.template_subject (
			"template_id",
			"subject_name",
			"is_clever",
			"clever_subject_id",
			"clever_subject_name",
			"hours",
			"subject_no",
			"learning_area",
			"credits",
			"is_extra"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id;
	`

	if entity.Hours == nil {
		entity.Hours = helper.ToPtr(100) //default value
	}

	err = tx.QueryRowx(
		query,
		entity.TemplateId,
		entity.SubjectName,
		entity.IsClever,
		entity.CleverSubjectId,
		entity.CleverSubjectName,
		entity.Hours,
		entity.SubjectNo,
		entity.LearningArea,
		entity.Credits,
		entity.IsExtra,
	).Scan(&insertId)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	return insertId, nil
}
