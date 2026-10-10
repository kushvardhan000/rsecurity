const fs = require('fs');

function fix(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Convert back from my broken sed
    content = content.replace(/<motion\.div\s*key="form"([\s\S]*?)onSubmit=\{handleSubmit\}([\s\S]*?)>/, 
`<motion.div key="form" $1 $2>
                          <form onSubmit={handleSubmit} className="space-y-4">`);
                          
    // The closing tag is a little tricky, so let's just find the `</motion.div>` before `)}` and `<AnimatePresence>` 
    content = content.replace(/<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>/g, '</form></motion.div>)}</AnimatePresence>');
    
    fs.writeFileSync(file, content);
}
// wait, I can just use git checkout to restore and then fix properly!
