package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) SubjectListByTeacherId(teacherId string, pagination *helper.Pagination) ([]constant.SubjectListByTeacherIdResponse, error) {
	baseQuery := `
		SELECT DISTINCT ON (s.id)
			s.id,
			s."name",
			sy."short_name" as seed_year_short_name
		FROM subject.subject_teacher st
		LEFT JOIN 
			subject.subject s ON s.id = st.subject_id
		LEFT JOIN 
			curriculum_group.subject_group sg 
			ON sg.id = s.subject_group_id
		LEFT JOIN
		    curriculum_group.year y
		    ON y.id = sg.year_id
		LEFT JOIN 
			curriculum_group.seed_year sy 
			ON sy.id = y.seed_year_id
		WHERE 
			st.teacher_id = $1
		`

	totalCount, err := helper.GetTotalCount(postgresRepository.Database, baseQuery, teacherId)
	if err != nil {
		return nil, err
	}
	if totalCount == 0 {
		return []constant.SubjectListByTeacherIdResponse{}, nil
	}
	pagination.TotalCount = totalCount

	baseQuery += `LIMIT $2 OFFSET $3`
	subjectList := []constant.SubjectListByTeacherIdResponse{}
	err = postgresRepository.Database.Select(&subjectList, baseQuery, teacherId, pagination.Limit, pagination.Offset)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subjectList, nil
}
