const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/Services.jsx',
  'src/pages/host/Finance.jsx',
  'src/pages/host/HostContractCreate.jsx',
  'src/pages/host/HostDashboard.jsx',
  'src/pages/host/RoomDetail.jsx',
  'src/pages/host/RoomEdit.jsx',
  'src/pages/host/RoomMatrix.jsx',
  'src/pages/host/buildings/BuildingDetail.jsx',
  'src/pages/host/buildings/BuildingList.jsx',
  'src/pages/tenant/TenantDashboard.jsx',
  'src/pages/tenant/TenantDetail.jsx',
  'src/pages/tenant/TenantEdit.jsx'
];

function migrateFile(filePath) {
  const absolutePath = path.resolve(filePath);
  let content = fs.readFileSync(absolutePath, 'utf8');

  // Regex to find <Grid ... > or <Grid ... />
  // This regex handles multi-line Grid components
  const gridRegex = /<Grid\b([\s\S]*?)\/?>/g;

  let newContent = content.replace(gridRegex, (match, props) => {
    let hasContainer = /\bcontainer\b/.test(props);
    let hasItem = /\bitem\b/.test(props);
    
    let updatedProps = props;

    // Handle Breakpoints
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'];
    let sizeValues = {};
    let foundBreakpoints = false;

    breakpoints.forEach(bp => {
      const bpRegex = new RegExp(`\\b${bp}=\\{([^}]*)\\}(\\s|$)`, 'g');
      const bpMatch = bpRegex.exec(updatedProps);
      if (bpMatch) {
        sizeValues[bp] = bpMatch[1].trim();
        updatedProps = updatedProps.replace(bpRegex, '$2');
        foundBreakpoints = true;
      } else {
          // Check for non-braced values like xs={6} or xs="6" or xs={12}
          const bpRegexSimple = new RegExp(`\\b${bp}=([\\d"]+|\\{[^}]*\\})(\\s|$)`, 'g');
          const bpMatchSimple = bpRegexSimple.exec(updatedProps);
          if (bpMatchSimple) {
              let val = bpMatchSimple[1].trim();
              if (val.startsWith('{') && val.endsWith('}')) {
                  val = val.substring(1, val.length - 1);
              }
              sizeValues[bp] = val;
              updatedProps = updatedProps.replace(bpRegexSimple, '$2');
              foundBreakpoints = true;
          }
      }
    });

    // Remove item prop
    if (hasItem) {
      updatedProps = updatedProps.replace(/\bitem\b\s*/g, '');
    }

    // Add size prop if breakpoints were found
    if (foundBreakpoints) {
      const sizeStr = 'size={{ ' + Object.entries(sizeValues).map(([k, v]) => `${k}: ${v}`).join(', ') + ' }} ';
      // Try to insert size where the first breakpoint was, or at the beginning
      updatedProps = sizeStr + updatedProps;
    }

    // Handle container and sx
    if (hasContainer) {
      const sxRegex = /sx=\{\{([^}]*)\}\}/;
      const sxMatch = sxRegex.exec(updatedProps);
      if (sxMatch) {
        let sxContent = sxMatch[1].trim();
        if (!sxContent.includes("width: '100%'") && !sxContent.includes('width: "100%"')) {
          if (sxContent && !sxContent.endsWith(',')) sxContent += ', ';
          sxContent += "width: '100%', margin: 0";
          updatedProps = updatedProps.replace(sxRegex, `sx={{ ${sxContent} }}`);
        }
      } else {
        updatedProps = updatedProps.trim() + " sx={{ width: '100%', margin: 0 }}";
      }
    }

    // Clean up extra spaces
    updatedProps = updatedProps.replace(/\s+/g, ' ').trim();
    
    // Construct the final tag
    if (match.endsWith('/>')) {
        return `<Grid ${updatedProps} />`;
    } else {
        return `<Grid ${updatedProps}>`;
    }
  });

  if (content !== newContent) {
    fs.writeFileSync(absolutePath, newContent);
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`No changes needed for ${filePath}`);
  }
}

files.forEach(migrateFile);
