const fs = require('fs');

function fixFiles(file) {
    let text = fs.readFileSync(file, 'utf8');
    text = text.replace(/<form className="w-full">\s*<form onSubmit=\{handleSubmit\}[^>]*>/, '<form onSubmit={handleSubmit} className="space-y-4">');
    text = text.replace(/<motion\.div([\s\S]*?)key="form"([\s\S]*?)>\s*<form onSubmit=\{handleSubmit\} className="space-y-4">/,
    '<motion.div$1key="form"$2>\n<form onSubmit={handleSubmit} className="space-y-4">');
    fs.writeFileSync(file, text);
}

fixFiles('src/components/cta/CTA.tsx');
fixFiles('src/components/careers/CareersClient.tsx');
