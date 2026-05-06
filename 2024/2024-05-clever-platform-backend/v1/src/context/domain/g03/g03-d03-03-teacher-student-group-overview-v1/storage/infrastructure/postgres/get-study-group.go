package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/constant"

func (postgresRepository postgresRepository) GetStudyGroup(studyGroupId int) (entity constant.StudyGroupEntity, err error) {
	query := `
		SELECT
			*
		FROM
			"class"."study_group"
		WHERE
			id = $1
	`
	args := []interface{}{studyGroupId}
	err = postgresRepository.Database.QueryRowx(query, args...).StructScan(&entity)
	if err != nil {
		return
	}
	return
}
