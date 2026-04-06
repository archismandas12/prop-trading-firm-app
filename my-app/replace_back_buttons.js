const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'src', 'screens');
const files = fs.readdirSync(screensDir).filter(f => f.endsWith('.tsx'));

let count = 0;

for (const file of files) {
  const filePath = path.join(screensDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already imported
  if (content.includes("import { BackButton }")) continue;

  const hasChevronLeft = content.includes('name="chevron-left"');
  if (!hasChevronLeft) continue;

  // Pattern 1:
  // <TouchableOpacity style={s.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
  //   <Feather name="chevron-left" size={24} color={colors.textPrimary} style={{ flexShrink: 0 }} />
  //   <Text style={s.headerNavText}...>...</Text>
  // </TouchableOpacity>
  
  // We will replace standard touchable wrapped chevrons with a universal layout line.
  // Actually, since there are many variations, we can use regex to replace the back button touchable.

  // Let's do a more robust string replacement carefully.
  const importString = "import { BackButton } from '../components/ui/BackButton';";
  
  // Insert import after the last import
  const lastImportIndex = content.lastIndexOf('import ');
  const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
  content = content.slice(0, insertIndex) + importString + '\n' + content.slice(insertIndex);

  // Replace SettingsScreen style (circular back button):
  content = content.replace(
    /<TouchableOpacity style=\{s\.backButton\}[^>]*>\s*<Feather name="chevron-left"[^>]*\/>\s*<\/TouchableOpacity>/g,
    '<BackButton />'
  );

  // Replace Breadcrumb style:
  // <TouchableOpacity style={s.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
  //   <Feather name="chevron-left" size={24} color={colors.textPrimary} style={{ flexShrink: 0 }} />
  //   <Text
  content = content.replace(
    /<TouchableOpacity([^>]*)>\s*<Feather name="chevron-left"[^>]*\/>\s*(<Text[^>]*>.*?<\/Text>)\s*<\/TouchableOpacity>/gs,
    '<View $1>\n          <BackButton />\n          $2\n        </View>'
  );

  // There are some where back button is just inside a View or on its own.
  // Let's catch any remaining basic back buttons that are just touchable -> feather
  content = content.replace(
    /<TouchableOpacity[^>]*>\s*<Feather name="chevron-left" size=\{24\}[^>]*\/>\s*<\/TouchableOpacity>/g,
    '<BackButton />'
  );

  // Rename the style `s.backButton` to `s.backRow` to avoid confusion
  content = content.replace(/style=\{s\.backButton\}/g, 'style={s.backRow}');
  content = content.replace(/backButton: \{/g, 'backRow: {');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Processed', file);
  count++;
}

console.log(`Finished processing ${count} files.`);
