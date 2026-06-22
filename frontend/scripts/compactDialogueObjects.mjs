import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const sourceRoot = path.resolve('src');

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'generated') files.push(...await collectSourceFiles(fullPath));
    } else if (/\.(?:ts|tsx)$/.test(entry.name) && !/\.(?:test|spec)\.(?:ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function propertyName(property) {
  if (!property.name) return '';
  return ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) ? property.name.text : '';
}

function compactDialogueObjects(source, fileName) {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const replacements = [];

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const names = new Set(node.properties.map(propertyName));
      const start = node.getStart(sourceFile);
      const end = node.end;
      const raw = source.slice(start, end);
      const hasMultilineTemplate = node.properties.some((property) => (
        ts.isPropertyAssignment(property)
        && (ts.isTemplateExpression(property.initializer) || ts.isNoSubstitutionTemplateLiteral(property.initializer))
        && /\r?\n/.test(property.initializer.getText(sourceFile))
      ));
      if (
        names.has('speaker')
        && names.has('text')
        && /\r?\n/.test(raw)
        && !hasMultilineTemplate
        && !raw.includes('//')
        && !raw.includes('/*')
      ) {
        replacements.push({ start, end, text: raw.replace(/\r?\n\s*/g, ' ') });
        return;
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  let output = source;
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    output = output.slice(0, replacement.start) + replacement.text + output.slice(replacement.end);
  }
  return { output, count: replacements.length };
}

let total = 0;
for (const file of await collectSourceFiles(sourceRoot)) {
  const source = await readFile(file, 'utf8');
  const { output, count } = compactDialogueObjects(source, file);
  if (!count) continue;
  await writeFile(file, output, 'utf8');
  total += count;
  console.log(`${path.relative(process.cwd(), file)}: ${count}`);
}
console.log(`Compacted ${total} dialogue objects.`);
