const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      walk(path.join(dir, file), fileList);
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        fileList.push(path.join(dir, file));
      }
    }
  }
  return fileList;
}

const files = walk(path.join(__dirname, 'my-app', 'src'));

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Mass replace old Gold and matching colors
  content = content.replace(/\['#C29037',\s*'#EDC26A',\s*'#C29037'\]/gi, "['#60A5FA', '#3B82F6', '#60A5FA']");
  content = content.replace(/\['#C29037',\s*'#EDC26A'\]/gi, "['#60A5FA', '#3B82F6']");
  content = content.replace(/#D4AF3726/gi, "rgba(59, 130, 246, 0.15)");
  content = content.replace(/#D4AF3740/gi, "rgba(59, 130, 246, 0.25)");
  content = content.replace(/#D4AF37/gi, "#3B82F6");
  content = content.replace(/#d4af37/gi, "#3B82F6");
  content = content.replace(/rgba\(212,\s*175,\s*55/gi, "rgba(59, 130, 246");
  content = content.replace(/#FDE08B/gi, "#F8FAFC");
  content = content.replace(/#CFA144/gi, "#22D3EE");
  content = content.replace(/rgba\(207,\s*161,\s*68/gi, "rgba(34, 211, 238");
  content = content.replace(/#EDC26A/gi, "#60A5FA");
  content = content.replace(/#A97B2C/gi, "#3B82F6");
  content = content.replace(/#E6C485/gi, "#60A5FA");
  
  // Remove Georgia fontFamily mapping
  content = content.replace(/fontFamily:\s*['"]Georgia['"],?/gi, "");

  // ActiveDashboardScreen.tsx buttons text
  // we want black text if the button is cyan/blue, actually we can use white text for blue buttons!
  // In `LoginScreen` and `ActiveDashboardScreen`:
  // `<Text style={s.btnGoldTxt}>Start Your Challenge</Text>` with `#000000` -> we want `#FFFFFF`
  if (file.includes('ActiveDashboardScreen') && content.includes('#000000')) {
    content = content.replace(/color:\s*['"]#000000['"]/gi, "color: '#FFFFFF'");
  }
  if (file.includes('AppHeader') || file.includes('AppBackground') || file.includes('AuthBackground')) {
      content = content.replace(/color:\s*['"]#000000['"]/gi, "color: '#FFFFFF'");
  }
  
  if (originalContent !== content) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Updated ${path.basename(file)}`);
  }
}

console.log(`Done. Updated ${changedFiles} files.`);
