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
    await page
        .$$eval(
            "script, [rel=dns-prefetch], [rel=alternate], [rel=archives], form, #commentlist, .akismet_comment_form_privacy_notice",
            (nodeList) => nodeList.forEach((element) => element.remove())
        )
        .catch();
    return await page
        .$eval("html", (element) => element.outerHTML)
        .catch()
        .then((result) => (!result ? null : result));
}

export async function getText(
    selector: string,
    page: Page
): Promise<string | null> {
    const element = await page.$(selector);
    if (element === null) return Promise.resolve("");
    return page
        .$eval(selector, (element) => {
            if (!element) return "";
            return element.textContent;
        })
        .catch()
        .then((result) => (!result ? null : result));
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
