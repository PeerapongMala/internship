package constant

import (
	"time"
)

type UserFilter struct {
	Id        string `query:"id"`
	Email     string `query:"email"`
	Title     string `query:"title"`
	FirstName string `query:"first_name"`
	LastName  string `query:"last_name"`
	Status    string `query:"status"`
	LastLogin time.Time
	Roles     []int `query:"roles"`
}

type StudentFilter struct {
	StudentId  string `query:"student_id"`
	SchoolId   int    `query:"school_id"`
	SchoolCode string `query:"school_code"`
	Status     string `query:"status"`
	FirstName  string `query:"first_name"`
}

type AnnouncerFilter struct {
	SchoolId  int    `query:"school_id"`
	FirstName string `query:"first_name"`
	LastName  string `query:"last_name"`
	Status    string `query:"status"`
}

type ObserverFilter struct {
	Id               string `query:"id"`
	ObserverAccessId int    `query:"observer_access_id"`
	Status           string `query:"status"`
	UserFilter
}

type UserBulkEditItem struct {
	UserId string `json:"user_id" validate:"required"`
	Status string `json:"status" validate:"required"`
}

type ObserverAccessFilter struct {
	ObserverAccessId *int    `query:"observer_access_id"`
	Name             *string `query:"name"`
	AccessName       *string `query:"access_name"`
}
