const fs = require('fs');
const res = JSON.parse(fs.readFileSync('eslint-warnings.json', 'utf8'));
for(const file of res) {
    if(file.warningCount === 0) continue;
    let lines = fs.readFileSync(file.filePath, 'utf8').split('\n');
    let toInsert = [];
    for(const msg of file.messages) {
        if(msg.severity === 1) {
            toInsert.push({line: msg.line - 1, disable: msg.ruleId});
            if (msg.ruleId === 'prefer-const' && msg.fix) {
                 // skip, not handled by comment easily
            }
        }
    }
    toInsert.sort((a,b) => b.line - a.line);
    for(const t of toInsert) {
        lines.splice(t.line, 0, `// eslint-disable-next-line ${t.disable}`);
    }
    fs.writeFileSync(file.filePath, lines.join('\n'));
}
