package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) BugCaseListImage(bugReportId int) ([]string, error) {
	query := `
		SELECT
			"image_url"
		FROM
			"bug"."bug_report_image"
		WHERE	
			"bug_report_id" = $1
	`
	images := []string{}
	err := postgresRepository.Database.Select(&images, query, bugReportId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return images, nil
}
