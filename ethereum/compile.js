const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const contractsPath = path.resolve(__dirname, 'contracts');
const buildPath = path.resolve(__dirname, '.build');

const getFilesRecursive = (dir) => {
  let files = [];

  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const currentPath = path.resolve(dir, dirent.name);

    if (dirent.isDirectory()) {
      files = files.concat(getFilesRecursive(currentPath));
    } else {
      files.push(currentPath);
    }
  });

  return files;
}

const compileContracts = (files) => {
  let contracts = {};

  files.forEach(file => {
    const fileName = path.basename(file);
    const fileContent = fs.readFileSync(file, 'utf-8');

    const compileOptions = {
      language: 'Solidity',
      sources: {
        [fileName]: {
          content: fileContent,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*'],
          },
        },
      },
    };

    const compiledOutput = JSON.parse(solc.compile(JSON.stringify(compileOptions), { import: findImports })).contracts[fileName];

    contracts = Object.assign(contracts, compiledOutput);
  });

  return contracts;
}

const findImports = (importPath) => {
  const filePath = path.resolve(contractsPath, importPath);

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    return {
      contents: fileContent
    };
  }
  else throw Error(`Import file not found - ${importPath}`);
}

const writeFiles = (contracts) => {
  fs.removeSync(buildPath);
  fs.ensureDirSync(buildPath);

  for (let contract in contracts) {
    const jsonFilePath = path.resolve(buildPath, `${contract}.json`);

    fs.outputJSONSync(jsonFilePath, contracts[contract], { spaces: 2 }, (err) => {
      console.log(`Error trying to write file: ${contract}.json`, err);
    });

    console.log(`Contract compiled to file: ${contract}.json`);
  }
}

const compile = () => {
  const files = getFilesRecursive(contractsPath);

  const contracts = compileContracts(files);

  writeFiles(contracts);
}

compile();
