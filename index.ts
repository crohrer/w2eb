#!/usr/bin/env ts-node
import { addChapter } from "./src/add-chapter";
import { storageFileName } from './src/constants'
import { crawl } from "./src/crawl";
import "./types";
const { Command } = require("commander");
const program = new Command();

program.description("Access the JSON Placeholder API");
program.name("w2eb");
program.usage("add-chapter <url>");

program
    .command("add-chapter")
    .argument("<url>", "url of the first page of the chapter.")
    .option("-n, --next <nextSelector>", "selector for a link to the next page.")
    .option("-c, --content <contentSelector>", "selector of the text content.")
    .option("-i, --ignore <ignoreSelector>", "selector of elements that should be ignored from the content.")
    .description(
        "Add a new chapter via url"
    )
    .action(addChapter);

program
    .command('crawl')
    .description(`completes data in ${storageFileName} by requesting the urls for the missing html.`)
    .action(crawl);

program.parse();
