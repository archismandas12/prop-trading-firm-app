const fs = require('fs');
const files = [
  'src/screens/AccountMetricsScreen.tsx',
  'src/screens/LeaderboardScreen.tsx',
  'src/screens/NewChallengeScreen.tsx',
  'src/screens/TradersAnalysisScreen.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf-8');
  content = content.replace(/import \{\s*import \{ BackButton \} from '\.\.\/components\/ui\/BackButton';/g, "import { BackButton } from '../components/ui/BackButton';\nimport {");
  fs.writeFileSync(f, content, 'utf-8');
});

console.log('Fixed imports!');
