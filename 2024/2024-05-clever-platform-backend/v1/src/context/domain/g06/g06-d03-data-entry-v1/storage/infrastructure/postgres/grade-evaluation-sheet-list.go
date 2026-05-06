package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) EvaluationSheetList(tx *sqlx.Tx, filter constant.EvaluationSheetListFilter, pagination *helper.Pagination) ([]constant.EvaluationSheetListEntity, error) {
	var err error
	if tx == nil {
		tx, err = postgresRepository.BeginTx()
		if err != nil {
			return nil, err
		}

		defer func() {
			if err != nil {
				tx.Rollback()
				return
			}

			tx.Commit()
		}()
	}

	query := `
		SELECT
			DISTINCT es.id, 
			es.form_id, 
			es.value_type, 
			evaluation_form_subject_id, 
			evaluation_form_general_evaluation_id, 
			es.is_lock, 
			es.status,
			ef.school_id,
			ef.academic_year,
			ef.year,
			ef.school_room,
			ef.school_term,
			ts.subject_name as subject_name,
			efge.template_type as general_type,
			efge.template_name as general_name
		FROM grade.evaluation_sheet es
		LEFT JOIN grade.evaluation_form ef ON es.form_id = ef.id
		LEFT JOIN grade.evaluation_form_additional_person efap ON ef.id = efap.form_id
		LEFT JOIN grade.evaluation_form_subject efs ON es.evaluation_form_subject_id = efs.id
		LEFT JOIN grade.template_subject ts ON efs.template_subject_id = ts.id    
		LEFT JOIN grade.evaluation_form_general_evaluation efge ON es.evaluation_form_general_evaluation_id = efge.id
	`
	if filter.UserId != "" {
		query += `
			CROSS JOIN target_classes
		`
	}
	query += `
		WHERE 
			"school_id" = $1 
			and es.status IN ('enabled', 'sent', 'approve', 'draft')
	`
	args := []interface{}{filter.SchoolId}
	idx := 2

	if filter.UserId != "" {
		args = append(args, filter.UserId)
		idx++
		cte := `
			WITH "target_subjects" AS (
		    SELECT
				"subject_id" AS "id"
			FROM "subject"."subject_teacher" st
			WHERE "st"."teacher_id" = $2
		),
		"target_classes" AS (
		    SELECT
				"c"."academic_year",
				"c"."year",
				"c"."name"
		    FROM "school"."class_teacher" ct
		    INNER JOIN "class"."class" c ON "ct"."class_id" = "c"."id"
		    WHERE "ct"."teacher_id" = $2
		)`
		where := `
			AND ((
					es.evaluation_form_subject_id IS NOT NULL 
					AND (
						es.evaluation_form_subject_id IN (SELECT "id" FROM "target_subjects") 
						OR (efap.user_id = $2 AND (efs.id = efap.value_id OR efge.id = efap.value_id))
					)
				)
			    OR (
			        es.evaluation_form_subject_id IS NULL
			        AND (
			            (ef.academic_year = target_classes.academic_year::text
			           	AND ef.year = target_classes.year
			            AND ef.school_room = target_classes.name)
			           	OR (efap.value_type = 'GENERAL_EVALUATION' AND efap.user_id = $2 AND efge.id = efap.value_id))
				)	
			)
		`
		query = fmt.Sprintf(`%s %s %s`, cte, query, where)
	}

	if filter.SubjectId != nil {
		query += fmt.Sprintf("AND evaluation_form_subject_id = $%d", idx)
		args = append(args, *filter.SubjectId)
		idx++
	}
	if filter.GeneralEvaluationId != nil {
		query += fmt.Sprintf("AND evaluation_form_general_evaluation_id = $%d", idx)
		args = append(args, *filter.GeneralEvaluationId)
		idx++
	}

	if filter.FormID != 0 {
		query += fmt.Sprintf("AND es.form_id = $%d", idx)
		args = append(args, filter.FormID)
		idx++
	}

	if filter.Year != "" {
		query += fmt.Sprintf(` AND "ef"."year" = $%d`, idx)
		args = append(args, filter.Year)
		idx++
	}
	if filter.AcademicYear != "" {
		query += fmt.Sprintf(` AND "ef"."academic_year" = $%d`, idx)
		args = append(args, filter.AcademicYear)
		idx++
	}
	if filter.SchoolRoom != "" {
		query += fmt.Sprintf(` AND "school_room" = $%d`, idx)
		args = append(args, filter.SchoolRoom)
		idx++
	}
	if filter.SchoolTerm != "" {
		query += fmt.Sprintf(` AND "school_term" = $%d`, idx)
		args = append(args, filter.SchoolTerm)
		idx++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND es.status = $%d`, idx)
		args = append(args, filter.Status)
		idx++
	}
	if filter.SubjectName != "" {
		query += fmt.Sprintf(` AND ts.subject_name = $%d`, idx)
		args = append(args, filter.SubjectName)
		idx++
	}
	if filter.GeneralType != "" {
		query += fmt.Sprintf(` AND efge.template_type = $%d`, idx)
		args = append(args, filter.GeneralType)
		idx++
	}
	if filter.GeneralName != "" {
		query += fmt.Sprintf(` AND efge.template_name = $%d`, idx)
		args = append(args, filter.GeneralName)
		idx++
	}
	if filter.OnlySubject {
		query += fmt.Sprintf(` AND es.evaluation_form_subject_id IS NOT NULL AND evaluation_form_general_evaluation_id IS NULL`)
	}

	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM (%s) as count_table", query)
	err = tx.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	query += fmt.Sprintf(` ORDER BY "%s" %s`, pagination.SortBBy, pagination.SortOrder)
	query += fmt.Sprintf(` LIMIT $%d OFFSET $%d`, idx, idx+1)
	args = append(args, pagination.Limit, pagination.Offset)

	entities := []constant.EvaluationSheetListEntity{}
	err = tx.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
