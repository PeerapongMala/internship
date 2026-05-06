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

var (
	AllRoles = []Role{Admin, ContentCreator, GameMaster, Observer, Announcer, Teacher, Student, Parent}
	RoleList = []Role{Admin, ContentCreator, GameMaster, Observer, Announcer, Teacher, Student, Parent}
)
