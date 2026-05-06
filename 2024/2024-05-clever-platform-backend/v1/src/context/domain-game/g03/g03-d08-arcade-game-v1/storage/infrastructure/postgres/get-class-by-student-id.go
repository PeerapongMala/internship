package postgres

func (postgresRepository *postgresRepository) GetClassByStudentId(studentId string, schoolId int) (int, error) {
	query := `
SELECT 
	"c"."id"
FROM "school"."class_student" cs
LEFT JOIN "class"."class" c
ON "cs"."class_id" = "c"."id"

WHERE 
"cs"."student_id" = $1
	AND "c"."school_id" = $2
ORDER BY "c"."academic_year" DESC
LIMIT 1

`
	var ClassId int
	err := postgresRepository.Database.QueryRow(query, studentId, schoolId).Scan(&ClassId)
	if err != nil {
		return 0, err
	}
	return ClassId, nil
}
