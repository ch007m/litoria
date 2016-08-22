listPackages = function(pkgs) {
    if (!pkgs.length) {
        console.error('packages required');
        process.exit(1);
    }

    if (program.force)
        console.log('  force: install');
    pkgs.forEach(function(pkg){
        console.log('  install : %s', pkg);
    });
}

listDirectories = function(pkgs) {
    if (!pkgs.length) {
        console.error('packages required');
        process.exit(1);
    }

    if (program.force)
        console.log('  force: install');
    pkgs.forEach(function(pkg){
        console.log('  install : %s', pkg);
    });
}

module.exports = {};