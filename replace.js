const fs = require('fs');
const file = 'app/checkout/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/rounded-2xl/g, 'rounded-xl');
content = content.replace(/bg-black\/20/g, 'bg-white/5');
content = content.replace(/focus:border-\[var\(--primary\)\]/g, 'focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)]');

fs.writeFileSync(file, content);
