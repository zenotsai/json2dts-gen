const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const staticBuildDir = resolveApp('static')
const staticProjectDir = resolveApp('../utools-json2dts');
function clean(dir) {
  const files = fs.readdirSync(dir);
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dir, files[i]);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      clean(filePath);
    } else {
      fs.unlinkSync(filePath)
    }
  }
  fs.rmdirSync(dir)
}

if (fs.existsSync(staticBuildDir)) {
  console.log('clean...')
  clean(staticBuildDir);
}
console.log('build static files...')
exec(`pnpm run build:vs`, {
  cwd: staticProjectDir
}, (err, stdout, stderr ) => {
  if (!err) {
    fs.renameSync(path.resolve(staticProjectDir, 'build'),staticBuildDir,function(err){
      if(err){
         console.log(err) 
      } else {
        console.log('copied')
      }
    })
  }


})



