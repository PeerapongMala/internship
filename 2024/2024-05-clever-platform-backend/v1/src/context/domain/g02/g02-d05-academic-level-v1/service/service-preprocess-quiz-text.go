package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"regexp"
	"strings"
)

type PreprocessQuizTextInput struct {
	Text string
	Type string
}

type PreprocessQuizTextOutput struct {
	Text string
}

func (service *serviceStruct) PreprocessQuizText(in *PreprocessQuizTextInput) *PreprocessQuizTextOutput {
	// fraction
	pattern := `([^ \t\r\n]*){([0-9.A-zก-ฮ❑]+)}{([0-9.A-zก-ฮ❑]+)}([^ \t\r\n]*)`
	re := regexp.MustCompile(pattern)
	in.Text = re.ReplaceAllString(in.Text, `$$$1\frac{$2}{$3}$4$$`)

	// angle
	pattern = `\{A:(\w)(\w)(\w)[^}]*\}`
	re = regexp.MustCompile(pattern)
	in.Text = re.ReplaceAllString(in.Text, `$$$1\hat{${2}}$3$`)

	// radius line
	pattern = `\{R:([^\}]{2})[^}]*\}`
	re = regexp.MustCompile(pattern)
	in.Text = re.ReplaceAllString(in.Text, `$\overrightarrow {$1}$`)

	// line segment
	pattern = `\{SL:([^\}]{2})[^}]*\}`
	re = regexp.MustCompile(pattern)
	in.Text = re.ReplaceAllString(in.Text, `$\overline {$1}$`)

	// line
	pattern = `\{L:([^\}]{2})[^}]*\}`
	re = regexp.MustCompile(pattern)
	in.Text = re.ReplaceAllString(in.Text, `$\overleftrightarrow {$1}$`)

	// short division
	pattern = `\{SD:([^\}]+)\}`
	re = regexp.MustCompile(pattern)
	in.Text = re.ReplaceAllString(in.Text, `$)\underline{$1}$`)

	// long division
	pattern = `\{LD:([^\}]+)\}`
	re = regexp.MustCompile(pattern)
	in.Text = re.ReplaceAllString(in.Text, `$\overline{)$1}$`)

	switch in.Type {
	case constant.Description:
		in.Text = strings.ReplaceAll(in.Text, "\n", " $\\\\$ ")
	}

	return &PreprocessQuizTextOutput{Text: in.Text}
}
