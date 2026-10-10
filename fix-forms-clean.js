const fs = require('fs');

function updateForm(filePath, typeVal) {
    let content = fs.readFileSync(filePath, 'utf8');
    const oldSimSubmit = /\/\/\s*Simulated submit API request[\s\S]*?await new Promise\(\(r\) => setTimeout\(\s*r,\s*1200\s*\)\);/;
    
    // Replace the simulated request with real api call
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
    content = content.replace(/We'll review your application/g, 'We&apos;ll review your application');
    
    fs.writeFileSync(filePath, content);
}

updateForm('src/components/cta/CTA.tsx', 'cta');
updateForm('src/components/careers/CareersClient.tsx', 'careers');
