import { addChapter } from "./add-chapter";
import { startBrowser, open, stopBrowser, getHrefs } from "./page";

export async function chapterList(
    url: string,
    options: ChapterListOptions
): Promise<void> {
    if (!url) return;
    const { link, content, ignore, next, title, author } = options;
    const browser = await startBrowser();
    await open(url, browser)
        .then(async (page) => {
            await getHrefs(link || "a", page).then(hrefs => {
                hrefs.forEach(href  => {
                    addChapter(href, { content, ignore, next, title, author });
                })
            });
            await page.close();
        })
        .catch((error) =>
            console.log(`chapter-list caused a puppeteer error: ${error}`)
        );

    await stopBrowser(browser);
}
