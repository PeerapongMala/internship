package postgres

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-global-announce-v1/constant"
)

func (postgresRepository *postgresRepository) GetAnnounce() ([]constant.AnnounceResponse, error) {
	query := `SELECT 
    id,
    school_id,
    scope,
    type,
    started_at,
    ended_at,
    title,
    description,
    image_url,
    status,
    created_at,
    created_by,
    updated_at,
    updated_by
	FROM "announcement"."announcement";`

	announces := []constant.AnnounceResponse{}

	err := postgresRepository.Database.Select(&announces, query)
	if err != nil {
		return nil, err
	}

	return announces, nil
}

func (postgresRepository *postgresRepository) TeacherDailyAnnounce(c constant.GetDailyAnnounceResquest) ([]constant.DailyAnnounceResponse, error) {

	query := `
        SELECT id, started_at, ended_at, title, description, image_url
        FROM "announcement"."announcement"
        WHERE type = 'Teacher' AND status = 'enabled' AND school_id = $1
    `
	rows, err := postgresRepository.Database.Query(query, c.SchoolId)
	if err != nil {
		return nil, err
	}

	response := []constant.DailyAnnounceResponse{}

	for rows.Next() {
		announce := constant.DailyAnnounceResponse{}
		err := rows.Scan(
			&announce.Id,
			&announce.StartAt,
			&announce.EndAt,
			&announce.Title,
			&announce.Description,
			&announce.Image,
		)
		if err != nil {
			return nil, err
		}
		startAt, err := time.Parse(time.RFC3339, announce.StartAt)
		if err != nil {
			return nil, err
		}
		endAt, err := time.Parse(time.RFC3339, announce.EndAt)
		if c.LoginTime.After(startAt) && c.LoginTime.Before(endAt) {
			response = append(response, announce)
		}
	}

	return response, nil
}
func (postgresRepository *postgresRepository) SystemDailyAnnounce(c constant.GetDailyAnnounceResquest) ([]constant.DailyAnnounceResponse, error) {

	query := `
        SELECT id, started_at, ended_at, title, description, image_url
        FROM "announcement"."announcement"
        WHERE type = 'System' AND status = 'enabled' AND school_id = $1
    `
	rows, err := postgresRepository.Database.Query(query, c.SchoolId)
	if err != nil {
		return nil, err
	}

	response := []constant.DailyAnnounceResponse{}

	for rows.Next() {
		announce := constant.DailyAnnounceResponse{}
		err := rows.Scan(
			&announce.Id,
			&announce.StartAt,
			&announce.EndAt,
			&announce.Title,
			&announce.Description,
			&announce.Image,
		)
		if err != nil {
			return nil, err
		}
		startAt, err := time.Parse(time.RFC3339, announce.StartAt)
		if err != nil {
			return nil, err
		}
		endAt, err := time.Parse(time.RFC3339, announce.EndAt)
		if c.LoginTime.After(startAt) && c.LoginTime.Before(endAt) {
			response = append(response, announce)
		}
	}

	return response, nil
}
