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
    
    // Now fix AnimatePresence element type
    content = content.replace(/<motion\.form\n\s*key="form"/, '<motion.div\n                          key="form"');
    content = content.replace(/onSubmit=\{handleSubmit\}\n/, '');
    content = content.replace(/className="space-y-(\w+)"\n\s*>/, 'className="w-full"\n                        >\n                          <form onSubmit={handleSubmit} className="space-y-$1">');
    // For CTA.tsx which has className="w-full space-y-4"
    content = content.replace(/className="w-full space-y-4"\n\s*>/, 'className="w-full"\n                        >\n                          <form onSubmit={handleSubmit} className="space-y-4">');

    // Replace the specific </motion.form> with </form></motion.div>
    content = content.replace(/<\/motion\.form>/, '</form>\n                        </motion.div>');

    // also fix eslint unescaped quote in Careers
    content = content.replace(/We'll review your application/g, 'We&apos;ll review your application');

    fs.writeFileSync(filePath, content);
}

updateForm('src/components/cta/CTA.tsx', 'cta');
updateForm('src/components/careers/CareersClient.tsx', 'careers');
