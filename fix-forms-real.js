const fs = require('fs');

let cta = fs.readFileSync('src/components/cta/CTA.tsx', 'utf8');
cta = cta.replace(/<motion\.div([\s\S]*?)key="form"([\s\S]*?)onSubmit=\{handleSubmit\}([\s\S]*?)className="([^"]+)"/, 
'<motion.div$1key="form"$2className="w-full">\n                  <form onSubmit={handleSubmit} className="$4"');
fs.writeFileSync('src/components/cta/CTA.tsx', cta);

let careers = fs.readFileSync('src/components/careers/CareersClient.tsx', 'utf8');
careers = careers.replace(/<motion\.div([\s\S]*?)key="form"([\s\S]*?)onSubmit=\{handleSubmit\}([\s\S]*?)className="([^"]+)"/, 
'<motion.div$1key="form"$2className="w-full">\n                  <form onSubmit={handleSubmit} className="$4"');
fs.writeFileSync('src/components/careers/CareersClient.tsx', careers);

