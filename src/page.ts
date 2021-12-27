import "../types";
const puppeteer = require("puppeteer");
import { Browser, Page } from "puppeteer";

export async function startBrowser(): Promise<Browser> {
    return await puppeteer.launch();
}

export async function stopBrowser(browser: Browser): Promise<void> {
    return await browser.close();
}

export async function open(url: string, browser: Browser): Promise<Page> {
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

export async function getHtml(page: Page): Promise<string | null> {
    const isWindows1252 =
        (await page.$(`meta[content="text/html; charset=windows-1252"]`)) !==
        null;
    await page
        .$$eval(
            "script, [rel=dns-prefetch], [rel=alternate], [rel=archives], form, #commentlist, .akismet_comment_form_privacy_notice",
            (nodeList) => nodeList.forEach((element) => element.remove())
        )
        .catch();
    return await page
        .$eval("html", (element) => element.outerHTML)
        .catch()
        .then((result) =>
            !result ? null : isWindows1252 ? fromWindows1252(result) : result
        );
}

export async function getText(
    selector: string,
    page: Page
): Promise<string | null> {
    const element = await page.$(selector);
    if (element === null) return Promise.resolve("");
    const isWindows1252 = await page.$(`meta[content="text/html; charset=windows-1252"]`) !== null;
    return page
        .$eval(selector, (element) => {
            if (!element) return "";
            return element.textContent;
        })
        .catch()
        .then((result) =>
            !result ? null : isWindows1252 ? fromWindows1252(result) : result
        );
}

export async function getHref(
    selector: string,
    page: Page
): Promise<string | null> {
    const element = await page.$(selector);
    if (element === null) return Promise.resolve(null);
    return page
        .$eval(selector, (element) => {
            if (!element) return null;
            return new URL(element.getAttribute("href"), window.location.href)
                .href;
        })
        .catch()
        .then((result) => (!result ? null : result));
}

export async function getHrefs(
    selector: string,
    page: Page
): Promise<string[]> {
    return await page
        .$$eval(selector, (nodeList) => {
            const nodes = Array.from(nodeList);
            return nodes.map(
                (element) =>
                    new URL(element.getAttribute("href"), window.location.href)
                        .href
            );
        })
        .then((hrefs) => hrefs.filter((href: string) => !!href))
        .catch();
}

// some pages are not marked correctly as windows-1252 encoded. This tries to fix that: via https://stackoverflow.com/a/42453062
const WINDOWS_1252 =
    "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";

function fromWindows1252(binaryString: string): string {
    var text = "";

    for (var i = 0; i < binaryString.length; i++) {
        text += WINDOWS_1252.charAt(binaryString.charCodeAt(i));
    }

    return text;
}
