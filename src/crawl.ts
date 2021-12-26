import { Page } from "puppeteer";
import { isUrlDuplicate } from "./add-chapter";
import { startBrowser, open, stopBrowser } from "./page";
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
            if (html) break;
            if (!url) {
                console.log(`${id} does not have a url`);
                break;
            }
            console.log(`${id}: requesting ${url}`);
            await open(url, browser)
                .then(async (page) => {
                    const contentHtml = await getElementHtml(
                        content || "body",
                        page
                    );
                    if (contentHtml === null) {
                        console.log(`${id}: content element not found`);
                        return;
                    }
                    const hash = `${sha256(url)}`;
                    writeHtml(hash, contentHtml);
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

async function getElementHtml(
    selector: string,
    page: Page
): Promise<string | null> {
    return page
        .$eval(selector, (element) => element.innerHTML)
        .then((result) => (!result ? null : result));
}

async function getHref(selector: string, page: Page): Promise<string | null> {
    return page
        .$eval(selector, (element) => element.getAttribute("href"))
        .then((result) => (!result ? null : result));
}
