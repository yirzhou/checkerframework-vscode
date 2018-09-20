"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const vscode_languageclient_1 = require("vscode-languageclient");
const vscode_1 = require("vscode");
function activate(context) {
    console.log(getExecutableCommand());
    console.log(getExecutableArgs());
    console.log(getExecutableOptions());
    let serverOptions = {
        command: getExecutableCommand(),
        args: getExecutableArgs(),
        options: getExecutableOptions(),
    };
    let clientOptions = {
        documentSelector: ['java'],
        synchronize: {
            configurationSection: 'checker-framework',
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.clientrc')
        }
    };
    let disposable = new vscode_languageclient_1.LanguageClient('checker-framework', 'Checker Framework', serverOptions, clientOptions).start();
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
    // no-op
}
exports.deactivate = deactivate;
function getExecutableCommand() {
    let binName = /^win/.test(process.platform) ? 'java.exe' : 'java';
    let javaHomeCandidates = [vscode_1.workspace.getConfiguration('java').get('home', null), process.env['JDK_HOME'], process.env['JAVA_HOME']];
    let result = javaHomeCandidates.find((candidate) => {
        if (!candidate)
            return false;
        return fs.existsSync(path.join(candidate, 'bin', binName));
    });
    if (result)
        return path.join(result, 'bin', binName);
    result = process.env['PATH'].split(path.delimiter).find((candidate) => {
        if (!candidate)
            return false;
        return fs.existsSync(path.join(candidate, binName));
    });
    return path.join(result, binName);
}
function getExecutableArgs() {
    let frameworkPath = vscode_1.workspace.getConfiguration('checker-framework').get('frameworkPath');
    let checkerPath = `${frameworkPath}/checker/dist/checker.jar`;
    let fatJarPath = `${__dirname}/libs/lsp-javac-0.1.0.jar`;
    let classpath = `.:${checkerPath}:${fatJarPath}`;
    let mainClass = 'org.checkerframework.LanguageServerStarter';
    return ['-cp', classpath, mainClass];
}
function getExecutableOptions() {
    return {
        cwd: vscode_1.workspace.workspaceFolders[0].uri.toString(),
    };
}
//# sourceMappingURL=extension.js.map