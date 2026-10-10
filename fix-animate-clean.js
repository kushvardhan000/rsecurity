const fs = require('fs');

function fix(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // <motion.form key="form" onSubmit={handleSubmit} ... className="my-class">
    // Should become:
    // <motion.div key="form" ... className="w-full">
    //   <form onSubmit={handleSubmit} className="my-class">
    
    const openingRegex = /<motion\.form\s+key="form"\s+onSubmit=\{handleSubmit\}([\s\S]*?)className="([^"]+)"\s*>/;
    const match = content.match(openingRegex);
    if(match) {
        const replacement = `<motion.div key="form"${match[1]}className="w-full">\n<form onSubmit={handleSubmit} className="${match[2]}">`;
        content = content.replace(openingRegex, replacement);
        // Replace ONLY the matching closing tag
        content = content.replace(/<\/motion\.form>/, '</form>\n</motion.div>');
        fs.writeFileSync(filePath, content);
    }
}

fix('src/components/cta/CTA.tsx');
fix('src/components/careers/CareersClient.tsx');
