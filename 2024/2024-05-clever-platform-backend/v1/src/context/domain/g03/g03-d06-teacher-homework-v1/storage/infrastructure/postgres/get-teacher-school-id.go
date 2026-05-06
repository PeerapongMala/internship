package postgres

import "log"

func (postgresRepository *postgresRepository) GetTeacherSchoolId(teacherId string) (schoolId int, err error) {
	query := `
		SELECT
			"school_id"
		FROM "school"."school_teacher" 
		WHERE "user_id" = $1
	`
	err = postgresRepository.Database.QueryRowx(query, teacherId).Scan(&schoolId)
	if err != nil {
		log.Printf("%+v", err)
		return 0, err
	}
	return schoolId, nil
}
