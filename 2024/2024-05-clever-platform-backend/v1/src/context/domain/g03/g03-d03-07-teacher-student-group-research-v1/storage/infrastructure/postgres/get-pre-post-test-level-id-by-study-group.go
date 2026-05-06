package postgres

import (
	"fmt"
	academicLevelConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (p *postgresRepository) GetPrePostTestLevelIDByStudyGroup(studyGroupID int) (*int, error) {

	query := fmt.Sprintf(`
		select ll.id
        from  level.level ll
            LEFT JOIN subject.sub_lesson ssl ON ssl.id = ll.sub_lesson_id
            LEFT JOIN subject.lesson sl ON sl.id = ssl.lesson_id
            LEFT JOIN subject.subject ss ON ss.id = sl.subject_id
            LEFT JOIN class.study_group sg ON sg.subject_id = ss.id
        WHERE
            sg.id = $1 AND
            LOWER(ll.level_type) LIKE LOWER($2)
	`)

	var levelId int
	if err := p.Database.QueryRowx(query, studyGroupID, academicLevelConstant.PrePostTest).Scan(&levelId); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &levelId, nil
}
