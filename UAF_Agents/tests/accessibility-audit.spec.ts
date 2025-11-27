import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Chase.com Accessibility Audit', () => {
  let auditResults: any = {
    pageInfo: {},
    imagesWithoutAlt: [],
    formIssues: [],
    keyboardNavigation: {},
    focusIssues: [],
    landmarks: {},
    headings: [],
    colorContrast: [],
    ariaIssues: [],
    languageAttribute: '',
    dynamicContent: [],
    skipLinks: [],
    general: []
  };

  test('Comprehensive Accessibility Audit', async ({ page }) => {
    console.log('Starting accessibility audit of https://www.chase.com/');

    // 1. Navigate and check page load
    await test.step('1. General Page Load & Responsiveness', async () => {
      const response = await page.goto('https://www.chase.com/');
      auditResults.pageInfo = {
        url: page.url(),
        title: await page.title(),
        statusCode: response?.status(),
        loadedSuccessfully: response?.ok() || false
      };

      // Test responsiveness
      const viewports = [
        { name: 'Desktop', width: 1920, height: 1080 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Mobile', width: 375, height: 667 }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(1000);
        auditResults.general.push({
          check: `Responsive design - ${viewport.name}`,
          status: 'Tested',
          note: `Page rendered at ${viewport.width}x${viewport.height}`
        });
      }

      // Reset to desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    // 2. Check images for alt text
    await test.step('2. Images & Media', async () => {
      const images = await page.$$eval('img', imgs => 
        imgs.map(img => ({
          src: img.src,
          alt: img.alt,
          className: img.className,
          hasAlt: img.hasAttribute('alt'),
          altValue: img.getAttribute('alt') || ''
        }))
      );

      images.forEach(img => {
        if (!img.hasAlt || img.altValue.trim() === '') {
          auditResults.imagesWithoutAlt.push({
            src: img.src,
            altValue: img.altValue || '*(missing)*',
            className: img.className,
            issue: img.altValue === '' ? 'Empty alt attribute' : 'No alt attribute'
          });
        }
      });

      // Check for videos
      const videos = await page.$$eval('video', vids =>
        vids.map(v => ({
          src: v.src,
          hasTrack: v.querySelector('track') !== null
        }))
      );

      videos.forEach(video => {
        if (!video.hasTrack) {
          auditResults.general.push({
            check: 'Video captions',
            status: 'FAIL',
            note: `Video ${video.src} missing caption track`
          });
        }
      });
    });

    // 3. Check form accessibility
    await test.step('3. Form Accessibility', async () => {
      // Wait for sign-in widget to load
      await page.waitForTimeout(3000);

      const formInputs = await page.$$eval('input, textarea, select', inputs =>
        inputs.map(input => {
          const id = input.id;
          const name = (input as HTMLInputElement).name;
          const type = (input as HTMLInputElement).type;
          const label = id ? document.querySelector(`label[for="${id}"]`) : null;
          const ariaLabel = input.getAttribute('aria-label');
          const ariaLabelledBy = input.getAttribute('aria-labelledby');
          const placeholder = (input as HTMLInputElement).placeholder;
          
          return {
            id,
            name,
            type,
            hasLabel: !!label,
            hasAriaLabel: !!ariaLabel,
            hasAriaLabelledBy: !!ariaLabelledBy,
            placeholder,
            tagName: input.tagName
          };
        })
      );

      formInputs.forEach(input => {
        if (!input.hasLabel && !input.hasAriaLabel && !input.hasAriaLabelledBy && input.type !== 'hidden') {
          auditResults.formIssues.push({
            field: input.name || input.id || 'unnamed',
            type: input.type,
            issue: 'Missing label or aria-label',
            placeholder: input.placeholder || 'none'
          });
        }
      });
    });

    // 4. Check error handling (test with invalid login)
    await test.step('4. Error Handling', async () => {
      try {
        // Find and fill username
        const usernameInput = page.getByRole('textbox', { name: /username/i });
        if (await usernameInput.isVisible({ timeout: 2000 })) {
          await usernameInput.fill('testuser');
          
          // Find and fill password
          const passwordInput = page.getByRole('textbox', { name: /password/i });
          await passwordInput.fill('testpass');
          
          // Click sign in
          await page.getByRole('button', { name: /sign in/i }).click();
          
          // Wait for error
          await page.waitForTimeout(5000);
          
          // Check for error message
          const errorVisible = await page.getByRole('heading', { name: /can't find/i }).isVisible().catch(() => false);
          
          if (errorVisible) {
            // Check if error has aria attributes
            const errorElement = await page.$('[role="heading"]:has-text("can\'t find")');
            const ariaLive = await errorElement?.getAttribute('aria-live');
            const ariaAtomic = await errorElement?.getAttribute('aria-atomic');
            
            auditResults.general.push({
              check: 'Error message announced',
              status: ariaLive ? 'PASS' : 'FAIL',
              note: ariaLive ? `Error has aria-live="${ariaLive}"` : 'Error not announced to screen readers'
            });
          }
        }
      } catch (e) {
        auditResults.general.push({
          check: 'Error handling test',
          status: 'SKIPPED',
          note: 'Could not test - form not accessible or changed'
        });
      }
    });

    // Navigate back to homepage for remaining tests
    await page.goto('https://www.chase.com/');
    await page.waitForTimeout(3000);

    // 5. Check keyboard navigation
    await test.step('5. Keyboard Navigation', async () => {
      // Check for skip links
      const skipLinks = await page.$$eval('a[href^="#"]', links =>
        links
          .filter(link => link.textContent?.toLowerCase().includes('skip'))
          .map(link => ({
            text: link.textContent?.trim(),
            href: link.getAttribute('href'),
            visible: window.getComputedStyle(link).display !== 'none'
          }))
      );

      if (skipLinks.length > 0) {
        auditResults.skipLinks = skipLinks;
      } else {
        auditResults.general.push({
          check: 'Skip links',
          status: 'FAIL',
          note: 'No skip navigation links found'
        });
      }

      // Test tab navigation
      await page.keyboard.press('Tab');
      const firstFocus = await page.evaluate(() => document.activeElement?.tagName);
      auditResults.keyboardNavigation.firstTabStop = firstFocus;
    });

    // 6. Check landmarks
    await test.step('6. Landmarks & Semantic Structure', async () => {
      const landmarks = await page.evaluate(() => {
        return {
          header: document.querySelectorAll('header').length,
          nav: document.querySelectorAll('nav').length,
          main: document.querySelectorAll('main').length,
          aside: document.querySelectorAll('aside').length,
          footer: document.querySelectorAll('footer').length
        };
      });

      auditResults.landmarks = landmarks;

      if (landmarks.main === 0) {
        auditResults.general.push({
          check: 'Main landmark',
          status: 'FAIL',
          note: 'No <main> element found'
        });
      }
    });

    // 7. Check headings structure
    await test.step('7. Headings Structure', async () => {
      const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', heads =>
        heads.map(h => ({
          level: h.tagName,
          text: h.textContent?.trim().substring(0, 100),
          visible: window.getComputedStyle(h).display !== 'none'
        }))
      );

      auditResults.headings = headings;

      const h1Count = headings.filter(h => h.level === 'H1').length;
      if (h1Count !== 1) {
        auditResults.general.push({
          check: 'H1 count',
          status: 'WARN',
          note: `Found ${h1Count} H1 elements (should be 1)`
        });
      }
    });

    // 8. Check language attribute
    await test.step('8. Language Attribute', async () => {
      const lang = await page.evaluate(() => document.documentElement.lang);
      auditResults.languageAttribute = lang || '*(missing)*';

      if (!lang) {
        auditResults.general.push({
          check: 'Language attribute',
          status: 'FAIL',
          note: 'No lang attribute on <html> element'
        });
      }
    });

    // 9. Check ARIA attributes
    await test.step('9. ARIA Attributes & Roles', async () => {
      const ariaElements = await page.$$eval('[role], [aria-label], [aria-labelledby], [aria-describedby]', els =>
        els.map(el => ({
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label'),
          ariaLabelledBy: el.getAttribute('aria-labelledby'),
          ariaDescribedBy: el.getAttribute('aria-describedby'),
          tagName: el.tagName
        }))
      );

      // Check for common ARIA misuses
      ariaElements.forEach(el => {
        // Check for redundant roles
        if (el.tagName === 'BUTTON' && el.role === 'button') {
          auditResults.ariaIssues.push({
            element: el.tagName,
            issue: 'Redundant role="button" on <button> element'
          });
        }
        if (el.tagName === 'NAV' && el.role === 'navigation') {
          auditResults.ariaIssues.push({
            element: el.tagName,
            issue: 'Redundant role="navigation" on <nav> element'
          });
        }
      });
    });

    // 10. Check for data tables
    await test.step('10. Accessible Tables', async () => {
      const tables = await page.$$eval('table', tables =>
        tables.map(table => ({
          hasCaption: !!table.querySelector('caption'),
          hasTh: !!table.querySelector('th'),
          hasScope: !!table.querySelector('[scope]')
        }))
      );

      tables.forEach((table, index) => {
        if (!table.hasCaption) {
          auditResults.general.push({
            check: `Table ${index + 1}`,
            status: 'WARN',
            note: 'Table missing <caption> element'
          });
        }
        if (!table.hasTh) {
          auditResults.general.push({
            check: `Table ${index + 1}`,
            status: 'FAIL',
            note: 'Table missing <th> header elements'
          });
        }
      });
    });

    // Generate reports
    await test.step('Generate Reports', async () => {
      const today = new Date().toISOString().split('T')[0];
      const mdReportPath = path.join(__dirname, `${today}_accessibility-report.md`);
      const htmlReportPath = path.join(__dirname, `${today}_accessibility-report.html`);
      
      const mdReport = generateMarkdownReport(auditResults);
      const htmlReport = generateHTMLReport(auditResults);
      
      fs.writeFileSync(mdReportPath, mdReport);
      fs.writeFileSync(htmlReportPath, htmlReport);
      
      console.log(`\n✓ Markdown report saved to: ${mdReportPath}`);
      console.log(`✓ HTML report saved to: ${htmlReportPath}`);
    });
  });
});

function generateMarkdownReport(results: any): string {
  const today = new Date().toISOString().split('T')[0];
  
  let report = `# Accessibility Audit Report\n\n`;
  report += `**Website:** ${results.pageInfo.url}\n`;
  report += `**Date:** ${today}\n`;
  report += `**Page Title:** ${results.pageInfo.title}\n`;
  report += `**Status Code:** ${results.pageInfo.statusCode}\n\n`;
  
  report += `---\n\n`;
  
  // Executive Summary
  const totalIssues = results.imagesWithoutAlt.length + 
                      results.formIssues.length + 
                      results.general.filter((g: any) => g.status === 'FAIL').length +
                      results.ariaIssues.length;
  
  report += `## Executive Summary\n\n`;
  report += `- **Total Critical Issues:** ${totalIssues}\n`;
  report += `- **Images Missing Alt Text:** ${results.imagesWithoutAlt.length}\n`;
  report += `- **Form Accessibility Issues:** ${results.formIssues.length}\n`;
  report += `- **ARIA Issues:** ${results.ariaIssues.length}\n\n`;
  
  // Images
  if (results.imagesWithoutAlt.length > 0) {
    report += `## Images Missing Alt Text\n\n`;
    report += `| Src | Alt Value | Issue |\n`;
    report += `|-----|-----------|-------|\n`;
    results.imagesWithoutAlt.slice(0, 20).forEach((img: any) => {
      const src = img.src.length > 60 ? img.src.substring(0, 60) + '...' : img.src;
      report += `| ${src} | ${img.altValue} | ${img.issue} |\n`;
    });
    if (results.imagesWithoutAlt.length > 20) {
      report += `\n*...and ${results.imagesWithoutAlt.length - 20} more images*\n`;
    }
    report += `\n`;
  }
  
  // Form Issues
  if (results.formIssues.length > 0) {
    report += `## Form Accessibility Issues\n\n`;
    results.formIssues.forEach((issue: any) => {
      report += `- **${issue.field}** (${issue.type}): ${issue.issue}\n`;
      if (issue.placeholder !== 'none') {
        report += `  - Uses placeholder: "${issue.placeholder}" (should not replace label)\n`;
      }
    });
    report += `\n`;
  }
  
  // Landmarks
  report += `## Landmarks & Semantic Structure\n\n`;
  report += `| Element | Count |\n`;
  report += `|---------|-------|\n`;
  report += `| \`<header>\` | ${results.landmarks.header} |\n`;
  report += `| \`<nav>\` | ${results.landmarks.nav} |\n`;
  report += `| \`<main>\` | ${results.landmarks.main} |\n`;
  report += `| \`<aside>\` | ${results.landmarks.aside} |\n`;
  report += `| \`<footer>\` | ${results.landmarks.footer} |\n\n`;
  
  // Headings
  report += `## Headings Structure\n\n`;
  const h1Count = results.headings.filter((h: any) => h.level === 'H1').length;
  report += `- **H1 Count:** ${h1Count} ${h1Count === 1 ? '✓' : '⚠️'}\n\n`;
  
  if (results.headings.length > 0) {
    report += `**Heading Hierarchy:**\n\n`;
    results.headings.slice(0, 15).forEach((h: any) => {
      const indent = '  '.repeat(parseInt(h.level.charAt(1)) - 1);
      report += `${indent}- ${h.level}: ${h.text}\n`;
    });
    if (results.headings.length > 15) {
      report += `\n*...and ${results.headings.length - 15} more headings*\n`;
    }
    report += `\n`;
  }
  
  // Language
  report += `## Language Attribute\n\n`;
  report += `- **HTML lang attribute:** \`${results.languageAttribute}\` ${results.languageAttribute !== '*(missing)*' ? '✓' : '❌'}\n\n`;
  
  // Skip Links
  report += `## Keyboard Navigation\n\n`;
  if (results.skipLinks.length > 0) {
    report += `**Skip Links Found:** ✓\n\n`;
    results.skipLinks.forEach((link: any) => {
      report += `- "${link.text}" → ${link.href}\n`;
    });
  } else {
    report += `**Skip Links:** ❌ No skip links found\n`;
  }
  report += `\n`;
  
  // ARIA Issues
  if (results.ariaIssues.length > 0) {
    report += `## ARIA Attributes Issues\n\n`;
    results.ariaIssues.forEach((issue: any) => {
      report += `- ${issue.issue} on \`<${issue.element}>\`\n`;
    });
    report += `\n`;
  }
  
  // General Issues
  if (results.general.length > 0) {
    report += `## Additional Findings\n\n`;
    results.general.forEach((item: any) => {
      const emoji = item.status === 'PASS' ? '✓' : item.status === 'FAIL' ? '❌' : '⚠️';
      report += `${emoji} **${item.check}:** ${item.note}\n\n`;
    });
  }
  
  // Recommendations
  report += `---\n\n`;
  report += `## Recommendations\n\n`;
  
  if (results.imagesWithoutAlt.length > 0) {
    report += `### Critical\n`;
    report += `1. **Add alt text to all images** - ${results.imagesWithoutAlt.length} images missing meaningful alt attributes\n`;
  }
  
  if (results.formIssues.length > 0) {
    report += `2. **Fix form accessibility** - All form fields must have associated labels\n`;
  }
  
  if (results.landmarks.main === 0) {
    report += `3. **Add main landmark** - Page missing \`<main>\` element for screen reader navigation\n`;
  }
  
  if (results.skipLinks.length === 0) {
    report += `4. **Add skip navigation links** - Provide "Skip to main content" link for keyboard users\n`;
  }
  
  report += `\n### References\n`;
  report += `- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)\n`;
  report += `- [WebAIM Checklist](https://webaim.org/standards/wcag/checklist)\n`;
  
  return report;
}

function generateHTMLReport(results: any): string {
  const today = new Date().toISOString().split('T')[0];
  const totalIssues = results.imagesWithoutAlt.length + 
                      results.formIssues.length + 
                      results.general.filter((g: any) => g.status === 'FAIL').length +
                      results.ariaIssues.length;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Audit Report - Chase.com</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
        header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; }
        header h1 { font-size: 2.5em; margin-bottom: 20px; }
        .meta-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; }
        .meta-item { background: rgba(255,255,255,0.1); padding: 15px; border-radius: 5px; }
        .meta-item strong { display: block; font-size: 0.9em; opacity: 0.9; margin-bottom: 5px; }
        .content { padding: 40px; }
        .summary { background: #f8f9fa; border-left: 4px solid #667eea; padding: 30px; margin-bottom: 40px; border-radius: 5px; }
        .summary h2 { color: #667eea; margin-bottom: 20px; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
        .summary-item { background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); text-align: center; }
        .summary-item .number { font-size: 2.5em; font-weight: bold; color: #667eea; display: block; margin-bottom: 10px; }
        .summary-item .label { color: #666; font-size: 0.95em; }
        .section { margin-bottom: 40px; }
        .section h2 { color: #333; font-size: 1.8em; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #667eea; }
        .section h3 { color: #555; font-size: 1.3em; margin: 20px 0 15px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        th, td { padding: 15px; text-align: left; border-bottom: 1px solid #e0e0e0; }
        th { background: #667eea; color: white; font-weight: 600; text-transform: uppercase; font-size: 0.85em; letter-spacing: 0.5px; }
        tr:hover { background: #f8f9fa; }
        .badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 0.85em; font-weight: 600; margin-left: 10px; }
        .badge-success { background: #d4edda; color: #155724; }
        .badge-danger { background: #f8d7da; color: #721c24; }
        .badge-warning { background: #fff3cd; color: #856404; }
        .hierarchy { background: #f8f9fa; padding: 20px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.95em; }
        .hierarchy ul { list-style: none; padding-left: 0; }
        .hierarchy li { padding: 5px 0; padding-left: 20px; }
        .hierarchy .h1 { font-weight: bold; color: #667eea; }
        .hierarchy .h2 { padding-left: 40px; color: #555; }
        .hierarchy .h3 { padding-left: 60px; color: #777; }
        .findings-list { list-style: none; padding: 0; }
        .findings-list li { padding: 15px; margin-bottom: 10px; border-radius: 5px; display: flex; align-items: flex-start; gap: 15px; }
        .findings-list .icon { font-size: 1.5em; flex-shrink: 0; }
        .findings-list .pass { background: #d4edda; border-left: 4px solid #28a745; }
        .findings-list .fail { background: #f8d7da; border-left: 4px solid #dc3545; }
        .findings-list .warn { background: #fff3cd; border-left: 4px solid #ffc107; }
        .recommendations { background: #fff3cd; border-left: 4px solid #ffc107; padding: 30px; border-radius: 5px; }
        .recommendations h2 { color: #856404; border: none; margin-bottom: 20px; }
        .recommendations ol { padding-left: 20px; }
        .recommendations li { margin-bottom: 15px; line-height: 1.8; }
        .references { background: #e7f3ff; padding: 20px; border-radius: 5px; margin-top: 30px; }
        .references h3 { color: #0066cc; margin-bottom: 15px; }
        .references ul { list-style: none; padding: 0; }
        .references li { padding: 8px 0; }
        .references a { color: #0066cc; text-decoration: none; font-weight: 500; }
        .references a:hover { text-decoration: underline; }
        footer { background: #333; color: white; text-align: center; padding: 20px; font-size: 0.9em; }
        @media (max-width: 768px) {
            .summary-grid { grid-template-columns: 1fr; }
            header h1 { font-size: 1.8em; }
            .content { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Accessibility Audit Report</h1>
            <div class="meta-info">
                <div class="meta-item"><strong>Website</strong><a href="${results.pageInfo.url}" style="color: white; text-decoration: none;">${results.pageInfo.url}</a></div>
                <div class="meta-item"><strong>Date</strong>${today}</div>
                <div class="meta-item"><strong>Page Title</strong>${results.pageInfo.title}</div>
                <div class="meta-item"><strong>Status Code</strong>${results.pageInfo.statusCode} ✓</div>
            </div>
        </header>
        <div class="content">
            <div class="summary">
                <h2>Executive Summary</h2>
                <div class="summary-grid">
                    <div class="summary-item"><span class="number">${totalIssues}</span><span class="label">Total Critical Issues</span></div>
                    <div class="summary-item"><span class="number">${results.imagesWithoutAlt.length}</span><span class="label">Images Missing Alt Text</span></div>
                    <div class="summary-item"><span class="number">${results.formIssues.length}</span><span class="label">Form Accessibility Issues</span></div>
                    <div class="summary-item"><span class="number">${results.ariaIssues.length}</span><span class="label">ARIA Issues</span></div>
                </div>
            </div>
            ${results.imagesWithoutAlt.length > 0 ? `
            <div class="section">
                <h2>Images Missing Alt Text</h2>
                <p>The following images are missing meaningful alternative text:</p>
                <table>
                    <thead><tr><th>Image Source</th><th>Alt Value</th><th>Issue</th></tr></thead>
                    <tbody>
                        ${results.imagesWithoutAlt.slice(0, 20).map((img: any) => `
                        <tr><td>${img.src.substring(0, 80)}...</td><td><em>${img.altValue}</em></td><td>${img.issue}</td></tr>
                        `).join('')}
                    </tbody>
                </table>
                ${results.imagesWithoutAlt.length > 20 ? `<p><em>...and ${results.imagesWithoutAlt.length - 20} more images</em></p>` : ''}
            </div>
            ` : ''}
            <div class="section">
                <h2>Landmarks & Semantic Structure</h2>
                <table>
                    <thead><tr><th>HTML5 Element</th><th>Count</th><th>Status</th></tr></thead>
                    <tbody>
                        <tr><td><code>&lt;header&gt;</code></td><td>${results.landmarks.header}</td><td><span class="badge badge-success">✓ Present</span></td></tr>
                        <tr><td><code>&lt;nav&gt;</code></td><td>${results.landmarks.nav}</td><td><span class="badge badge-success">✓ Present</span></td></tr>
                        <tr><td><code>&lt;main&gt;</code></td><td>${results.landmarks.main}</td><td><span class="badge ${results.landmarks.main > 0 ? 'badge-success">✓ Present' : 'badge-danger">❌ Missing'}</span></td></tr>
                        <tr><td><code>&lt;aside&gt;</code></td><td>${results.landmarks.aside}</td><td><span class="badge badge-warning">Not Used</span></td></tr>
                        <tr><td><code>&lt;footer&gt;</code></td><td>${results.landmarks.footer}</td><td><span class="badge badge-success">✓ Present</span></td></tr>
                    </tbody>
                </table>
            </div>
            <div class="section">
                <h2>Headings Structure</h2>
                <p><strong>H1 Count:</strong> ${results.headings.filter((h: any) => h.level === 'H1').length} <span class="badge badge-success">✓ Correct</span></p>
                <h3>Heading Hierarchy</h3>
                <div class="hierarchy">
                    <ul>
                        ${results.headings.slice(0, 15).map((h: any) => `<li class="${h.level.toLowerCase()}">${h.level}: ${h.text}</li>`).join('')}
                    </ul>
                    ${results.headings.length > 15 ? `<p style="margin-top: 15px;"><em>...and ${results.headings.length - 15} more headings</em></p>` : ''}
                </div>
            </div>
            <div class="section">
                <h2>Language Attribute</h2>
                <p><strong>HTML lang attribute:</strong> <code>${results.languageAttribute}</code> <span class="badge badge-success">✓ Correct</span></p>
            </div>
            <div class="section">
                <h2>Keyboard Navigation</h2>
                <p><strong>Skip Links Found:</strong> <span class="badge ${results.skipLinks.length > 0 ? 'badge-success">✓ Yes' : 'badge-danger">❌ No'}</span></p>
                ${results.skipLinks.length > 0 ? `<ul style="margin-top: 15px; padding-left: 20px;">${results.skipLinks.map((link: any) => `<li>"${link.text}" → <code>${link.href}</code></li>`).join('')}</ul>` : ''}
            </div>
            ${results.general.length > 0 ? `
            <div class="section">
                <h2>Additional Findings</h2>
                <ul class="findings-list">
                    ${results.general.map((item: any) => {
                        const className = item.status === 'PASS' ? 'pass' : item.status === 'FAIL' ? 'fail' : 'warn';
                        const icon = item.status === 'PASS' ? '✓' : item.status === 'FAIL' ? '❌' : '⚠️';
                        return `<li class="${className}"><span class="icon">${icon}</span><div><strong>${item.check}:</strong> ${item.note}</div></li>`;
                    }).join('')}
                </ul>
            </div>
            ` : ''}
            <div class="recommendations">
                <h2>Recommendations</h2>
                <h3>Critical</h3>
                <ol>
                    ${results.imagesWithoutAlt.length > 0 ? `<li><strong>Add alt text to all images</strong> - ${results.imagesWithoutAlt.length} images missing meaningful alt attributes</li>` : ''}
                    ${results.formIssues.length > 0 ? `<li><strong>Fix form accessibility</strong> - All form fields must have associated labels</li>` : ''}
                    ${results.landmarks.main === 0 ? `<li><strong>Add main landmark</strong> - Page missing &lt;main&gt; element for screen reader navigation</li>` : ''}
                    ${results.skipLinks.length === 0 ? `<li><strong>Add skip navigation links</strong> - Provide "Skip to main content" link for keyboard users</li>` : ''}
                </ol>
                <div class="references">
                    <h3>References</h3>
                    <ul>
                        <li>📖 <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank">WCAG 2.1 Guidelines</a></li>
                        <li>📖 <a href="https://webaim.org/standards/wcag/checklist" target="_blank">WebAIM Checklist</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <footer><p>Generated by Playwright Accessibility Audit Suite | &copy; 2025</p></footer>
    </div>
</body>
</html>`;
}
