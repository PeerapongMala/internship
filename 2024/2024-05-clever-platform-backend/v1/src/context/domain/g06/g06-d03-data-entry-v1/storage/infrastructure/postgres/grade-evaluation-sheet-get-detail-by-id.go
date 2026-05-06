package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) EvaluationSheetGetDetailById(id int) (*constant.EvaluationSheetDetail, error) {
	query := `
		SELECT 
			es.*,
			(SELECT "sub_u"."first_name" FROM "user"."user" sub_u WHERE sub_u."id" = es.updated_by LIMIT 1) AS updated_by,
			ef.school_id,
			ef.academic_year,
			ef.year,
			ef.school_room,
			ef.school_term,
			ts.subject_name as subject_name,
			efge.template_type as general_type,
			efge.template_name as general_name,
			COALESCE(efge.additional_data, gt.additional_data) as general_additional_data
		FROM
			grade.evaluation_sheet es
		LEFT JOIN grade.evaluation_form ef ON es.form_id = ef.id
		LEFT JOIN grade.evaluation_form_subject efs ON es.evaluation_form_subject_id = efs.id
		LEFT JOIN grade.template_subject ts ON efs.template_subject_id = ts.id    
		LEFT JOIN grade.evaluation_form_general_evaluation efge ON es.evaluation_form_general_evaluation_id = efge.id
		LEFT JOIN grade.template_general_evaluation tge ON efge.template_general_evaluation_id = tge.id
		LEFT JOIN grade.general_template gt ON tge.general_template_id = gt.id
		WHERE es.id = $1
	`

	var entity constant.EvaluationSheetDetail
	err := postgresRepository.Database.QueryRowx(query, id).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
