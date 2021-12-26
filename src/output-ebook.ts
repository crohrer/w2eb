import { readHtml, readStorage, writeStorage } from "./storage";
import epub from "epub-gen-memory";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs-extra");

export const outputEbook = (options: { title?: string }): void => {
    const data: Collection = readStorage();
    const { chapters, title, images } = data;
    const bookTitle = options.title || title;

    if (chapters.length === 0) {
        console.log("Book content is empty.");
        return;
    }

    if (!bookTitle) {
        console.log(
            "Book title is missing. Please use the -t option to set the title"
        );
        return;
    }
    data.title = bookTitle;
    data.images = !!images;
    writeStorage(data);
    console.log("start generating epub");

    epub(
        {
            title: bookTitle,
            numberChaptersInTOC: false,
            lang: "en",
        },
        chapters.map(({ title, author, webpages }) => ({
            title: title || "",
            author: author || "",
            content: webpages
                .map((webpage) => getCleanHtml(webpage, {images}))
                .join(""),
        }))
    ).then((buffer) => {
        const file = `${process.cwd()}/${bookTitle}.epub`;
        fs.writeFileSync(file, buffer);
        console.log(`wrote ${file}`);
    });
};

function getCleanHtml(webpage: Webpage, options: { images: boolean }): string {
    const {content, html, ignore} = webpage;
    const htmlString = html ? readHtml(html) : "";
    const dom = new JSDOM(htmlString);
    dom.window.document.querySelectorAll(ignore).forEach((el) => el.remove());
    if(!options.images){
        dom.window.document.querySelectorAll("img").forEach((el) => el.remove());
    }
    return dom.window.document.querySelector(content || "body").innerHTML;
}
