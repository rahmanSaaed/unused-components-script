// unused-components-checker.ts

import * as fs from 'fs';
import * as path from 'path';

const projectRoot = './'; // Replace with your actual project path

function getAngularComponents(directory: string): string[] {
  const componentFiles: string[] = [];
  try {
    const files = fs.readdirSync(directory, { withFileTypes: true });

    files.forEach((file) => {
      const filePath = path.join(directory, file.name);

      if (file.isDirectory()) {
        // Recursively get component files in subdirectories
        componentFiles.push(...getAngularComponents(filePath));
      } else if (file.isFile() && file.name.endsWith('.component.ts')) {
        componentFiles.push(filePath);
      }
    });
  } catch (error) {
    console.error(`Error reading directory: ${directory}`);
    console.error(error);
  }

  return componentFiles;
}

function findUsedComponents(componentFiles: string[]): string[] {
  const usedComponents: string[] = [];

  componentFiles.forEach((filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      const matches = content.match(/selector: ['"`]\s*app-(.*?)['"`]/);
      if (matches) {
        const componentName = matches[1];
        usedComponents.push(componentName);
      }
    } catch (error) {
      console.error(`Error reading file: ${filePath}`);
      console.error(error);
    }
  });

  return usedComponents;
}

function findUnusedComponents(allComponents: string[], usedComponents: string[]): string[] {
  return allComponents.filter((component) => !usedComponents.includes(component));
}

function main() {
  const angularComponents = getAngularComponents(projectRoot);
  const usedComponents = findUsedComponents(angularComponents);
  const unusedComponents = findUnusedComponents(angularComponents, usedComponents);

  console.log('Used Components:', usedComponents);
  console.log('Unused Components:', unusedComponents);
}

main();
