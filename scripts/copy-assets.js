const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const distDir = path.join(__dirname, '../dist');

function copyFile(src, dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
}

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.yaml') || filePath.endsWith('.yml') || filePath.endsWith('.html') || filePath.endsWith('.png') || filePath.endsWith('.jpg')) {
        const relativePath = path.relative(srcDir, filePath);
        const destPath = path.join(distDir, relativePath);
        copyFile(filePath, destPath);
    }
});
