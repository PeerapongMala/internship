package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectInfoBySheetID(sheetID int) (*constant.SubjectDataDetail, error) {
	query := `
		SELECT 
			es.id as id,
			COALESCE(ts.subject_no, efs.subject_no) as code,
			CASE
        		WHEN COALESCE(ts.is_extra, false) = true THEN 'extra'
        		ELSE 'primary'
    		END AS type,
			COALESCE(ts.learning_area, efs.learning_area) AS learning_area,
			COALESCE(ts.subject_name, efs.subject_name) as subject_name,
			COALESCE(ts.hours, efs.hours) as hours,
			COALESCE((SELECT SUM(ti.max_value) FROM grade.template_indicator ti WHERE ti.template_subject_id = ts.id), 0) as total_score,
			ts.subject_name as learning_group,
			COALESCE(ts.credits, 0) as credits,
			efge.template_type as general_type,
			efge.template_name as general_name,
			s.name as school_name,
			sa.name as school_area,
			(SELECT ARRAY_AGG(DISTINCT CONCAT(u.title, u.first_name, ' ', u.last_name))  FROM grade.evaluation_form_additional_person efap LEFT JOIN "user".user u ON u.id = efap.user_id WHERE es.form_id = efap.form_id and efap.user_type = 'teacher') as teacher,
			(SELECT ARRAY_AGG(DISTINCT CONCAT(u.title, u.first_name, ' ', u.last_name))  FROM class.class c INNER JOIN school.class_teacher ct ON c.id = ct.class_id INNER JOIN "user".user u ON ct.teacher_id = u.id WHERE c.academic_year::text = ef.academic_year AND c.year = ef.year AND c.name = ef.school_room) as teacher_advisor
		FROM
			grade.evaluation_sheet es
		LEFT JOIN grade.evaluation_form_subject efs ON es.evaluation_form_subject_id = efs.id
		LEFT JOIN grade.template_subject ts ON ts.id = efs.template_subject_id
		LEFT JOIN grade.evaluation_form_general_evaluation efge ON es.evaluation_form_general_evaluation_id = efge.id
		LEFT JOIN grade.evaluation_form ef ON ef.id = es.form_id
		LEFT JOIN school.school s ON s.id = ef.school_id
		LEFT JOIN school_affiliation.school_affiliation_school sas ON s.id = sas.school_id
		LEFT JOIN school_affiliation.school_affiliation sa ON sas.school_affiliation_id = sa.id
		WHERE es.id = $1
	`

	var entity constant.SubjectDataDetail
	err := postgresRepository.Database.QueryRowx(query, sheetID).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
