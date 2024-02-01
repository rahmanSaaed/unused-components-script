const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd(); // Replace with your actual project path

function getAngularComponents(directory) {
  const componentFiles = [];
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

function isComponentUsedInRoutes(componentFile) {
  try {
    const content = fs.readFileSync(componentFile, 'utf-8');

    // Check if the component is mentioned in the routes
    return content.includes('RouterModule.forChild([');
  } catch (error) {
    console.error(`Error reading file: ${componentFile}`);
    console.error(error);
    return false;
  }
}

function isComponentUsedInHTML(componentFile, selector) {
  try {
    const content = fs.readFileSync(componentFile, 'utf-8');

    // Check if the component selector is used in HTML
    return (
      content.includes(`</${selector}>`) ||
      content.includes(`'${selector}'`) ||
      content.includes(`"${selector}"`)
    );
  } catch (error) {
    console.error(`Error reading file: ${componentFile}`);
    console.error(error);
    return false;
  }
}

function main() {
  console.log('projectRoot', projectRoot);
  const angularComponents = getAngularComponents(projectRoot);
  const unusedComponents = [];
  const usedComponents = [];

  angularComponents.forEach((componentFile) => {
    const componentName = path.basename(componentFile, '.component.ts');

    // Check if the component is used in routes
    const isUsedInRoutes = isComponentUsedInRoutes(componentFile);

    // Check if the component selector is used in HTML
    const isUsedInHTML = isComponentUsedInHTML(componentFile, componentName);

    if (isUsedInRoutes || isUsedInHTML) {
      usedComponents.push(componentName);
    } else {
      unusedComponents.push(componentName);
    }
  });

  console.log('Used Components:', usedComponents);
  console.log('Unused Components:', unusedComponents);
}

main();
