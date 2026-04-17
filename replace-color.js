const fs = require('fs');
const path = require('path');

const files = [
  './app/notificacoes/page.tsx',
  './app/produtos/criar/page.tsx',
  './app/login/page.tsx',
  './app/cursos/page.tsx',
  './app/cursos/[id]/page.tsx',
  './app/onboarding/page.tsx',
  './app/financeiro/page.tsx',
  './app/downloads/page.tsx',
  './app/afiliados/page.tsx',
  './components/home-aluno.tsx',
  './components/produtos-vendedor-screen.tsx'
];

files.forEach(file => {
  const filePath = path.resolve(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/#FF6A00/g, '#FF5F00');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
