package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"

func (postgresRepository *postgresRepository) AnnouncementItemList(announceId int) ([]constant.ItemList, error) {
	query := `
	SELECT
	item_id
	FROM "announcement"."announcement_reward_item"
	WHERE announcemnet_reward_id = $1
	`
	rows, err := postgresRepository.Database.Query(query, announceId)
	if err != nil {
		return nil, err
	}
	responses := []constant.ItemList{}

	for rows.Next() {
		response := constant.ItemList{}
		rows.Scan(
			&response.ItemId,
		)
		responses = append(responses, response)
	}
	return responses, nil
}
