const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
function check(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) check(file);
    else if (file.endsWith('.js')) {
      const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
      if (result.status !== 0) process.exit(1);
    }
  }
}
check(path.resolve(__dirname, '..'));
console.log('JavaScript syntax checks passed.');
