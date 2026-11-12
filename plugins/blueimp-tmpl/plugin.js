
window.slidesk.blueimpTmpl = (x) => {

    async function evaluateCode(codeElement) {
        const code = codeElement.textContent.trim();

        const func = new Function(`return (${code})`);
        let result = func();

        // Handle async data functions
        if (typeof result === 'function') {
            result = await result();
        }

        return result;
    }

    async function renderTemplate(codeElement) {
        codeElement.classList.add('blueimp-code--loading');

        try {
            const tmplData = await evaluateCode(codeElement);

            const response = await fetch(tmplData.url);
            const html = await response.text();
            const compiled = tmpl(html);

            const rendered = compiled(tmplData);

            const container = document.createElement('div');
            container.className = 'blueimp-tmpl-container';
            codeElement.parentNode.parentNode.insertBefore(container, codeElement.nextSibling);

            container.innerHTML = rendered;

            // Success state
            codeElement.classList.remove('blueimp-code--loading');
            codeElement.classList.add('blueimp-code--rendered');
            codeElement.style.display = 'none';
        } catch (error) {

            console.error('Template rendering error:', error);

            codeElement.classList.remove('blueimp-code--loading');
            codeElement.classList.add('blueimp-code--error');
            codeElement.title = `Error: ${error.message}`;

            const errorDiv = document.createElement('div');
            errorDiv.className = 'blueimp-error';
            errorDiv.innerHTML = `<strong>Template Error:</strong> ${error.message}`;

            codeElement.parentNode.insertBefore(errorDiv, codeElement.nextSibling);
        }
    }

    document.querySelectorAll('.sd-current .language-blueimp-tmpl:not(.blueimp-code--rendered)').forEach(async element => {
        await renderTemplate(element);
    });
};

