'use strict';

module.exports = {
    listPackages: listPackages,
    listDirectories: listDirectories
};

function listPackages(pkgs,program) {
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

function listDirectories(pkgs,program) {
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