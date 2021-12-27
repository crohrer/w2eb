interface Collection {
    title?: string; // name that is used for the resulting e-book
    images?: boolean; // if this is true, it will include images
    chapters: Chapter[];
}

interface Chapter {
    title?: string; // title text
    author?: string; // author text
    webpages: Webpage[];
    url?: string; // page with links to multiple webpages for this chapter
    linkSelector?: string; // selector for the links to the webpages
}

interface Webpage {
    next?: string; // selector for next link - if this is missing, there is no next page
    content?: string; // selector for the text content
    ignore?: string; // selector to ignore parts of the content
    title?: string; // selector of title text
    author?: string; // selector of author text
    url?: string; // url of a single page with content
    html?: string; // the html content of the page
}

interface AddChapterOptions {
    next?: string; // selector for next-link
    content?: string; // selector of content
    ignore?: string; // selector what to ignore from the content
    title?: string; // selector of title text on individual webpages
    author?: string; // selector of author text on individual webpages
}

interface ChapterListOptions {
    link: string; // selector for chapter-links
    next?: string; // selector for next-link, that is used for individual webpages
    content?: string; // selector of content for individual webpages
    ignore?: string; // selector what to ignore from the content
    title?: string; // selector of title text on individual webpages
    author?: string; // selector of author text on individual webpages
}
