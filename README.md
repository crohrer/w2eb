# How to use

- Add Chapter: `w2eb add-chapter https://foo.com/chapter-content-page-1 --next="a.next-page"`

## Commands and arguments

### Add chapter

`w2eb add-chapter <url>`

- `--next`/`-n` selector for a link to the next page
- `--content`/`-c` selector for content element (default is body)
- `--ignore`/`-i` selector for elements that should be ignored in the content

### Find chapters

`w2eb chapter-list <url>`

- `--link`/`-l` selector for a chapter link
- all arguments from "add chapter"