const fs = require('fs');
const files = [
  'src/screens/SplitBillScreen.tsx',
  'src/screens/TradingJournalScreen.tsx',
  'src/screens/ForgotPasswordScreen.tsx',
  'src/screens/AccountMetricsScreen.tsx',
  'src/screens/AccountDetailsScreen.tsx',
  'src/components/cards/BalanceCard.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf-8');
  
  // Add import if missing
  if (!content.includes("import { BackButton }")) {
    const importString = "import { BackButton } from '../components/ui/BackButton';";
    // For components/cards, the path is different:
    const finalImport = f.includes('components/cards') 
      ? "import { BackButton } from '../ui/BackButton';"
      : "import { BackButton } from '../components/ui/BackButton';";
      
    const lastImportIndex = content.lastIndexOf('import ');
    const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
    content = content.slice(0, insertIndex) + finalImport + '\n' + content.slice(insertIndex);
  }

  // Replace arrow-left TouchableOpacity
  content = content.replace(
    /<TouchableOpacity[^>]*>\s*<Feather name="arrow-left"[^>]*\/>\s*<\/TouchableOpacity>/g,
    '<BackButton />'
  );
  
  // In some cases it might be inside a string or just isolated. Let's be sure.
  
  fs.writeFileSync(f, content, 'utf-8');
});

console.log('Replaced arrow-left back buttons!');
