# idojaras
Old "Weather forecast" Add-on for FireFox

## Build
1. install Node.js
2. install grunt-cli globally `npm install -g grunt-cli`
3. install node modules `npm install`
4. build js with grunt `grunt build`

## Install
1. Open firefox
2. Open page: `about:config` and set `xpinstall.signatures.required` to `false`
3. Open page: `about:addons`
4. Click on the gear icon and select `Install Add-on From File...`
5. Browse and open the generated `addon.xpi` file from the build folder.