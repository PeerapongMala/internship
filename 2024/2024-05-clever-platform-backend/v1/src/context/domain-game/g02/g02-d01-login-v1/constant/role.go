package constant

type Role int

const (
	Admin Role = iota + 1
	ContentCreator
	GameMaster

	Observer
	Announcer
	Teacher
	Student
	Parent
)
