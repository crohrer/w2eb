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
