interface Collection {
    chapters: Chapter[];
}

interface Chapter {
    title?: string;
    author?: string;
    tags?: string; // chapter tags
    webpages: Webpage[];
    url?: string; // page with links to multiple webpages for this chapter
    linkSelector?: string; // selector for the links to the webpages
}

interface Webpage {
    next?: string; // selector for next link - if this is missing, there is no next page
    content?: string; // selector for the text content
    ignore?: string; // selector to ignore parts of the content
    url?: string; // url of a single page with content
    html?: string; // the html content of the page
}

interface AddChapterOptions {
    next?: string;
    content?: string;
    ignore?: string;
    title?: string;
    author?: string;
}

interface ChapterListOptions extends AddChapterOptions {
    link: string;
}
