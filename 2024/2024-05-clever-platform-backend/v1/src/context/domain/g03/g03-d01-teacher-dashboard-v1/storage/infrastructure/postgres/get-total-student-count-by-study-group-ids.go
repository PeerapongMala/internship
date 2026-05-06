package postgres

import (
	"fmt"
	"strings"
)

func (p postgresRepository) GetTotalStudentCountByStudyGroupIds(studyGroupIds []int) (int, error) {
	if len(studyGroupIds) == 0 {
		return 0, nil
	}

	placeholders := make([]string, len(studyGroupIds))
	args := make([]interface{}, len(studyGroupIds))
	for i, id := range studyGroupIds {
		placeholders[i] = fmt.Sprintf("$%d", i+1)
		args[i] = id
	}

	query := fmt.Sprintf(`
		SELECT
			COUNT(sgs.student_id)
		FROM class.study_group_student sgs
		WHERE
			sgs.study_group_id IN (%s)
	`, strings.Join(placeholders, ", "))

	var count int
	err := p.Database.Get(&count, query, args...)
	if err != nil {
		return 0, fmt.Errorf("failed to get total student count by study group IDs: %w", err)
	}

	return count, nil
}
