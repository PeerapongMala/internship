package constant

import (
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/lib/pq"
)

type Message struct {
	ID         int       `json:"id" db:"id"`
	Content    *string   `json:"content" db:"content"`
	SchoolID   int       `json:"school_id" db:"school_id" params:"school_id"`
	SenderID   string    `json:"sender_id" db:"sender_id"`
	ReceiverID *string   `json:"reciever_id" db:"receiver_id" params:"reciever_id"`
	RoomID     string    `json:"room_id" db:"room_id"`
	RoomType   string    `json:"room_type" db:"room_type"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

type Client struct {
	SenderID   string
	ReceiverID []*string
	RoomID     []string
	Conn       *websocket.Conn
	RoomType   string
	SchoolID   int
}

type ChatListTeacher struct {
	Content      *string    `json:"content" db:"content"`
	SchoolID     int        `json:"school_id" db:"school_id"`
	SenderID     *string    `json:"sender_id" db:"sender_id"`
	SenderName   *string    `json:"sender_name" db:"sender_name"`
	RoomID       string     `json:"room_id" db:"room_id"`
	RoomType     string     `json:"room_type" db:"room_type"`
	CreatedAt    *time.Time `json:"created_at" db:"created_at"`
	RoomName     *string    `json:"room_name" db:"room_name"`
	ImageUrl     *string    `json:"image_url" db:"image_url"`
	MemberCount  *int       `json:"member_count" db:"member_count"`
	PrivateClass *string    `json:"private_class" db:"private_class"`
	AcademicYear *int       `json:"academic_year" db:"academic_year"`
	MessageID    *int       `json:"message_id" db:"message_id"`
}

type ChatListStudent struct {
	Content      *string         `json:"content" db:"content"`
	SchoolID     int             `json:"school_id" db:"school_id"`
	SenderID     *string         `json:"sender_id" db:"sender_id"`
	SenderName   *string         `json:"sender_name" db:"sender_name"`
	RoomID       string          `json:"room_id" db:"room_id"`
	RoomType     string          `json:"room_type" db:"room_type"`
	CreatedAt    *time.Time      `json:"created_at" db:"created_at"`
	RoomName     *string         `json:"room_name" db:"room_name"`
	ImageUrl     *string         `json:"image_url" db:"image_url"`
	MemberCount  *int            `json:"member_count" db:"member_count"`
	ClassName    *string         `json:"class_name" db:"class_name"`
	SubjectName  *pq.StringArray `json:"subject_name" db:"subject_name"`
	AcademicYear *int            `json:"academic_year" db:"academic_year"`
	MessageID    *int            `json:"message_id" db:"message_id"`
}

// type ListResponse struct {
type MessageList struct {
	Message   Message
	FirstName string  `json:"first_name" db:"first_name"`
	Lastname  string  `json:"last_name" db:"last_name"`
	ImageUrl  *string `json:"image_url" db:"image_url"`
}

type ChatResponse struct {
	FirstName string
	LastName  string
}

type ListInput struct {
	SchoolID   int
	RoomID     string
	RoomType   string
	Limit      int
	BeforeTime time.Time
}

type ListOutput struct {
	StatusCode int         `json:"status_code"`
	Data       interface{} `json:"data"`
	Message    string      `json:"message"`
}

type Member struct {
	UserId    *string `json:"user_id" db:"id"`
	Title     *string `json:"title" db:"title"`
	FirstName *string `json:"first_name" db:"first_name"`
	LastName  *string `json:"last_name" db:"last_name"`
	ImageUrl  *string `json:"image_Url" db:"image_url"`
}
