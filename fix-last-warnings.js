const fs = require('fs');
function killLine(file, match) {
  let lines = fs.readFileSync(file, 'utf8').split('\n');
  lines = lines.filter(l => !l.includes(match));
  fs.writeFileSync(file, lines.join('\n'));
}
killLine('src/components/membership/MembershipClient.tsx', 'SectionHeader');
killLine('src/components/services/Services.tsx', 'FeaturedService');
killLine('src/components/ui/PageHeader.tsx', 'index');
