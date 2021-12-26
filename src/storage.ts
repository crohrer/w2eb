const fs = require('fs-extra');
const crypto = require('crypto');
import { storageFileName, htmlDirectoryName } from './constants';
import '../types'

const file = `${process.cwd()}/${storageFileName}`
const htmlDirectory = `${process.cwd()}/${htmlDirectoryName}`

export function readStorage(): Collection {
    fs.ensureFileSync(file)
    const data: unknown = fs.readJsonSync(file, { throws: false })
    if (isCollection(data)) return data
    return { chapters: [] }
}

export function writeStorage(data: Collection): void {
    fs.ensureFileSync(file)
    fs.writeJsonSync(file, data)
}

export function writeHtml(name: string, data: string): void {
    const htmlFile = `${htmlDirectory}/${name}.html`;
    fs.ensureFileSync(htmlFile);
    fs.writeFileSync(htmlFile, data);
}

export function sha256(str: string): string {
    return crypto.createHash('sha256').update(str).digest('hex');
}

function isCollection(object: unknown): object is Collection {
    return (
        object &&
        Object.prototype.hasOwnProperty.call(object, 'chapters') &&
        Array.isArray((object as Collection).chapters)
    )
}
