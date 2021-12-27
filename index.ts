#!/usr/bin/env ts-node
import { addChapter } from "./src/add-chapter";
import { outputEbook } from "./src/output-ebook";
import { chapterList } from "./src/chapter-list";
import { crawl } from "./src/crawl";
import "./types";
const { Command } = require("commander");
const program = new Command();

program.description(
    "Convert multiple webpages into a single e-book with multiple chapters"
);
program.name("w2eb");
program.usage("add-chapter <url>");

program
    .command("add-chapter")
    .argument("<url>", "url of the first page of the chapter.")
    .option(
        "-n, --next <nextSelector>",
        "selector for a link to the next page."
    )
    .option("-c, --content <contentSelector>", "selector of the text content.")
    .option(
        "-i, --ignore <ignoreSelector>",
        "selector of elements that should be ignored from the content."
    )
    .option("-t, --title <title>", "selector for chapter title.")
    .option("-a, --author <author>", "selector for author name.")
    .description("Add a new chapter via URL")
    .action(addChapter);

program
    .command("crawl")
    .description(
        `collects the HTML contents by requesting the chapter URLs.`
    )
    .action(crawl);

program
    .command("export")
    .option("-t, --title <bookTitle>", "Title of the book.")
    .description("exports collected data as an e-book")
    .action(outputEbook);

program
    .command("chapter-list")
    .argument("<url>", "URL of the chapter list.")
    .option(
        "-l, --link <linkSelector>",
        "selector for the individual links to the chapters"
    )
    .option(
        "-n, --next <nextSelector>",
        "selector for a link to the next page."
    )
    .option("-c, --content <contentSelector>", "selector of the text content.")
    .option(
        "-i, --ignore <ignoreSelector>",
        "selector of elements that should be ignored from the content."
    )
    .option("-t, --title <title>", "selector for chapter title.")
    .option("-a, --author <author>", "selector for author name.")
    .description("adds a list of chapters via URL")
    .action(chapterList);

program.parse();
