package constant

type LeaderBoardFilter struct {
	ArcadeGameId int    `params:"arcadeGameId" validate:"required"`
	Date         string `query:"date"`
	Type         string `query:"type"`
	EventType    string `query:"event_type"`
	EventIndex   int    `query:"event_index"`
	EventId      int    `query:"event_id"`
}

type DataFilter struct {
	ClassId      []int
	SchoolId     []int
	StudentClass int
	EventName    string
	StartDate    string
	EndDate      string
	ArcadeGameId int
}

type AnnouncementEventTimeStamp struct {
	Title     string `db:"title"`
	StartedAt string `db:"started_at"`
	EndedAt   string `db:"ended_at"`
}

type SchoolEventRequest struct {
	EventName string
	StartDate string
	EndDate   string
}
