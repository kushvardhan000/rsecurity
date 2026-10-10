const fs = require('fs');

fs.writeFileSync('src/components/membership/MembershipClient.tsx', fs.readFileSync('src/components/membership/MembershipClient.tsx', 'utf8').replace(/import { SectionHeader } from "@\/src\/components\/ui\/SectionHeader";\n/g, ''));
fs.writeFileSync('src/components/services/Services.tsx', fs.readFileSync('src/components/services/Services.tsx', 'utf8').replace(/import { type FeaturedService } from "@\/src\/types";\n/g, ''));
fs.writeFileSync('src/components/ui/PageHeader.tsx', fs.readFileSync('src/components/ui/PageHeader.tsx', 'utf8').replace(/map\(\(path, index\)/, 'map((path, index)')); 
