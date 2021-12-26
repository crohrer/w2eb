import { Page } from "puppeteer";
import { isUrlDuplicate } from "./add-chapter";
import { startBrowser, open, stopBrowser, getHtml, getHref } from "./page";
import { readStorage, writeStorage, sha256, writeHtml } from "./storage";

export async function crawl() {
    const browser = await startBrowser();
    let data = readStorage();
    let webpagesCount: number = 0;
    for (let i = 0; i < data.chapters.length; i++) {
        const { webpages } = data.chapters[i];
        for (let j = 0; j < webpages.length; j++) {
            const { html, url, content, ignore, next } = webpages[j];
            const id = `chapter[${i}] webpage[${j}]`;
            if (html) continue;
            if (!url) {
                console.log(`${id} does not have a url`);
                continue;
            }
            console.log(`${id}: requesting ${url}`);
            await open(url, browser)
                .then(async (page) => {
                    const html = await getHtml(page);
                    if (html === null) {
                        console.log(`${id}: content element not found`);
                        return;
                    }
                    const hash = `${sha256(url)}`;
                    writeHtml(hash, html);
                    data.chapters[i].webpages[j].html = hash;
                    webpagesCount++;
                    if (next) {
                        const href = await getHref(next, page);
                        if (href && !isUrlDuplicate(href, data)) {
                            data.chapters[i].webpages.push({
                                url: href,
                                content,
                                ignore,
                                next,
                            });
                        }
                    }
                    writeStorage(data);
                    await page.close();
                })
                .catch((error) =>
                    console.log(`${id} caused a puppeteer error: ${error}`)
                );
        }
    }
    await stopBrowser(browser);
    console.log(`added HTML for ${webpagesCount} webpages.`);
}
