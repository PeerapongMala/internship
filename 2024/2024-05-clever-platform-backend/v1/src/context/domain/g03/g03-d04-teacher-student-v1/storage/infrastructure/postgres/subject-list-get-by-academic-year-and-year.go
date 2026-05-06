package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) SubjectListGetByAcademicYearAndYear(teacherId string, request constant.SubjectListGetByAcademicYearYearRequest, pagination *helper.Pagination) ([]constant.SubjectEntity, error) {
	baseQuery := `
		SELECT 
			s.id,
			s."name"
		FROM subject.subject s 
		LEFT JOIN 
			subject.subject_teacher st 
			ON st.subject_id = s.id
		LEFT JOIN 
			school.school_subject ss 
			ON ss.subject_id = s.id 
		LEFT JOIN
			class."class" c 
			ON c.school_id = ss.school_id
		WHERE 
			st.teacher_id = $1
			AND c."year" = $2
			AND c.academic_year = $3
		GROUP BY s.id `

	fmt.Println(request.Year)
	args := []any{teacherId, request.Year, request.AcademicYear}
	totalCount, err := helper.GetTotalCount(postgresRepository.Database, baseQuery, args...)
	if err != nil {
		return nil, err
	}
	if totalCount == 0 {
		return []constant.SubjectEntity{}, nil
	}
	pagination.TotalCount = totalCount

	if pagination.LimitResponse != -1 {
		baseQuery += `LIMIT $4 OFFSET $5`
		args = append(args, pagination.LimitResponse, pagination.Offset)
	}

	subjectList := []constant.SubjectEntity{}
	err = postgresRepository.Database.Select(&subjectList, baseQuery, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subjectList, nil
}
