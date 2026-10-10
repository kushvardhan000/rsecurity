const fs = require('fs');

function updateForm(filePath, typeVal) {
    let content = fs.readFileSync(filePath, 'utf8');
    const oldSimSubmit = /\/\/\s*Simulated submit API request[\s\S]*?await new Promise\(\(r\) => setTimeout\(\s*r,\s*1200\s*\)\);/;
    
    const realApiCall = `
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "${typeVal}" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrors({ message: err instanceof Error ? err.message : "An error occurred" });
      return;
    }
    `;
    content = content.replace(oldSimSubmit, realApiCall);
    
    content = content.replace(/<motion\.form\b/g, '<motion.div');
    content = content.replace(/<\/motion\.form>/g, '</form></motion.div>');
    content = content.replace(/We'll review your application/g, 'We&apos;ll review your application');

    // we must move the form tag!
    content = content.replace(/<motion\.div([^>]*)onSubmit=\{handleSubmit\}([^>]*)className="space-y-([^"]+)"\s*>/g, 
        '<motion.div$1$2>\n                        <form onSubmit={handleSubmit} className="space-y-$3">');
    // for string containing space-y-4 in cta
    content = content.replace(/<motion\.div([^>]*)onSubmit=\{handleSubmit\}([^>]*)className="w-full space-y-4"\s*>/g, 
        '<motion.div$1$2 className="w-full">\n                        <form onSubmit={handleSubmit} className="space-y-4">');
        
    fs.writeFileSync(filePath, content);
}

updateForm('src/components/cta/CTA.tsx', 'cta');
updateForm('src/components/careers/CareersClient.tsx', 'careers');
