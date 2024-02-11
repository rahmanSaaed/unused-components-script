const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const projectRoot = process.cwd();
// console.log("projectRoot", projectRoot);

function getAngularComponents(projectRootFolder) {
  const componentFiles = getAllComponentsFiles(projectRootFolder, '.component.ts');
  const components = [];

  componentFiles.forEach((file) => {
    // console.log("selectorMatch file", file);

    try {
      const content = fs.readFileSync(file, 'utf-8');
      const selectorMatch = content.match(/selector\s*:\s*['"`]([^'"`]*)['"`]/);
      const componentClasse = content.match(/\bclass\s+([^\s]+)\s*(?=\S)/);

      // console.log("classMatch", classMatch ? classMatch[1] : null);
      
      // console.log("classMatch", classMatch);

      if (selectorMatch && selectorMatch[1]) {
        components.push({
          file,
          selector: selectorMatch[1],
          componentClass: componentClasse ? componentClasse[1] : null
        });
      }
    } catch (error) {
      console.error(`Error reading file: ${file}`);
      console.error(error);
    }
  });
  console.log("components", components)
  return components;
}


function getAllComponentsFiles(projectRootFolder, extension) {
  const files = [];
  // console.log("files", files);

  try {
    const brojecItems = fs.readdirSync(projectRootFolder, { withFileTypes: true });
    // console.log("brojecItems list", brojecItems);
    brojecItems.forEach((item) => {
      const fullPath = path.join(projectRootFolder, item?.name);
      if (item.isDirectory()) {
        if (item.name !== 'node_modules') {
          files.push(...getAllComponentsFiles(fullPath, extension));
        }
      } else if (item.isFile() && item.name.endsWith(extension)) {
        files.push(fullPath);
      }
    });
  } catch (error) {
    console.error(`Error reading directory: ${projectRootFolder}`);
    console.error(error);
  }

  return files;
}



function isSelectorUsedInApp(projectRootFolder, selector) {
  const tsFiles = getAllComponentsFiles(projectRootFolder, '.ts');
  const htmlFiles = getAllComponentsFiles(projectRootFolder, '.html');

  for (const tsFile of tsFiles) {
    try {
      const content = fs.readFileSync(tsFile, 'utf-8');
      if (content.includes(`</${selector}>`)) {
        return true;
      }
    } catch (error) {
      console.error(`Error reading file: ${tsFile}`);
      console.error(error);
    }
  }

  for (const htmlFile of htmlFiles) {
    try {
      const content = fs.readFileSync(htmlFile, 'utf-8');
      if (content.includes(`</${selector}>`)) {
        return true;
      }
    } catch (error) {
      console.error(`Error reading file: ${htmlFile}`);
      console.error(error);
    }
  }

  return false;
}

function main() {
  const angularComponents = getAngularComponents(projectRoot);
  const unusedComponents = [];
// console.log("getAngularComponents", angularComponents);
  // angularComponents.forEach(({ file, selector }) => {
  //   const isUsed = isSelectorUsedInApp(projectRoot, selector);

  //   if (!isUsed) {
  //     unusedComponents.push({ file, selector });
  //   }
  // });

  // if (unusedComponents.length > 0) {
  //   console.log('Unused Components:');
  //   unusedComponents.forEach(({ file, selector }) => {
  //     console.log(`Component: ${file}, Selector: ${selector}`);
  //   });
  // } else {
  //   console.log('No unused components found.');
  // }
}

main();
