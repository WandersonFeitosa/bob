import { promises as fs } from 'fs';

export async function getFileNamesInFolder(folderPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(folderPath);
    return files;
  } catch (error) {
    console.error(`Erro ao encontrar o diretório.${folderPath}:`);
  }
}

