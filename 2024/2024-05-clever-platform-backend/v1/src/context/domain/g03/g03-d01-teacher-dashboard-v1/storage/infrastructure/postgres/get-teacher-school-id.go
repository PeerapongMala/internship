package postgres

func (postgresRepository *postgresRepository) GetTeacherSchoolId(teacherId string) (schoolId *int, err error) {
	type queryResult struct {
		SchoolId int `db:"school_id"`
	}
	query := `
		SELECT
			school_id
		FROM
			"school"."school_teacher"
		WHERE
			user_id = $1
		LIMIT 1
	`
	result := queryResult{}
	err = postgresRepository.Database.QueryRowx(query, teacherId).StructScan(&result)
	if err != nil {
		return
	}
	schoolId = &result.SchoolId
	return
}
