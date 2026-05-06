package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
)

func (postgresRepository *postgresRepository) GradeTemplateGetById(id int) (*constant.GradeTemplateWithSubject, error) {
	templateQuery := `
		SELECT
			"id",
			"school_id",
			"year",
			"template_name",
			"active_flag",
			"version",
			"status",
			"created_at",
			"created_by",
			"updated_at",
			(SELECT "sub_u"."first_name" FROM "user"."user" sub_u WHERE sub_u."id" = updated_by LIMIT 1) AS updated_by,
			"admin_login_as"
		FROM grade.template
		WHERE id = $1;
	`
	subjectTemplateQuery := `
		SELECT
			"id",
			"template_id",
			"subject_name",
			"subject_no",
			"learning_area",
			"clever_subject_template_id",
			"is_clever",
			"clever_subject_id",
			"clever_subject_name",
			"hours",
			"credits",
			"is_extra"
		FROM grade.template_subject
		WHERE template_id = $1;
	`

	generalTemplateQuery := `
		SELECT
			"id",
			"template_id",
			"template_type",
			"template_name",
			"additional_data",
			"general_template_id"
		FROM grade.template_general_evaluation
		WHERE template_id = $1;
	`

	var entity constant.GradeTemplateWithSubject

	err := postgresRepository.Database.QueryRowx(
		templateQuery,
		id,
	).StructScan(&entity.Template)
	if err != nil {
		return nil, err
	}

	entity.Subject = []constant.SubjectEntity{} //init empty array value
	err = postgresRepository.Database.Select(&entity.Subject, subjectTemplateQuery, id)
	if err != nil {
		return nil, err
	}

	entity.GeneralTemplate = []constant.TemplateGeneralEvaluationEntity{} //init empty array value
	err = postgresRepository.Database.Select(&entity.GeneralTemplate, generalTemplateQuery, id)
	if err != nil {
		return nil, err
	}

	return &entity, nil
}
