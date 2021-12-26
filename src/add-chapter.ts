import '../types'
import { readStorage, writeStorage } from './storage'

export async function addChapter(
    url: string,
    options: AddChapterOptions
): Promise<void> {
    const { content, next, ignore } = options
    let data = readStorage()
    if (
        isUrlDuplicate(url, data)
    ) {
        console.log('Duplicate URL, did not add chapter.')
        return
    }
    const newChapter: Chapter = {
        webpages: [{ url, content, next, ignore }],
    }
    data.chapters.push(newChapter)
    writeStorage(data)
    console.log('Added chapter.')
}

export function isUrlDuplicate(url: string, data: Collection): boolean {
    return data.chapters.some((chapter) =>
        chapter.webpages.some((page) => page.url === url)
    )
}
