package postgres

func (postgresRepository *postgresRepository) GetSchoolIdByStudentId(studentId string) (int, error) {
	query := `
	SELECT
	school_id
	FROM "user"."student"
	WHERE user_id = $1
	`
	var schoolId int
	err := postgresRepository.Database.QueryRow(query, studentId).Scan(&schoolId)
	if err != nil {
		return 0, err
	}
	return schoolId, nil
}
