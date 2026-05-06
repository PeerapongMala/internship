package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-leaderboard-v1/constant"
)

type LeaderboardRepository interface {
	LeaderboardGet() ([]constant.LeaderboardGetResponse, error)
	LeaderboardCreate(constant.LeaderboardCreateRequest) error
	LeaderboardDelete(id int64) error
	LeaderboardUpdate(constant.LeaderboardUpdateRequest) error
	//TeacherDailyAnnounce(constant.GetDailyAnnounceResquest) ([]constant.DailyAnnounceResponse, error)
	//SystemDailyAnnounce(constant.GetDailyAnnounceResquest) ([]constant.DailyAnnounceResponse, error)
}
