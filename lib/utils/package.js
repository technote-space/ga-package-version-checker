"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const github_action_helper_1 = require("@technote-space/github-action-helper");
const replace_in_file_1 = __importDefault(require("replace-in-file"));
const misc_1 = require("./misc");
const command_1 = require("./command");
const { getTagName } = github_action_helper_1.Utils;
const logger = new github_action_helper_1.Logger();
exports.updatePackageVersion = (context) => __awaiter(void 0, void 0, void 0, function* () {
    logger.startProcess('Updating package version...');
    const path = misc_1.getPackagePath();
    if (!fs_1.default.existsSync(path)) {
        logger.warn('File [package.json] not found.');
        logger.warn('Please checkout before call this GitHub Action.');
        return false;
    }
    const tagName = getTagName(context);
    if (!misc_1.isRequiredUpdate(misc_1.getPackageVersion(), tagName)) {
        logger.info('No update required.');
        return false;
    }
    logger.startProcess('Updating package version');
    const version = misc_1.getPackageVersionToUpdate(tagName);
    logger.displayStdout(misc_1.getReplaceResultMessages(yield replace_in_file_1.default({
        files: path,
        from: /"version"\s*:\s*"(v?).+?"\s*(,?)$/gm,
        to: `"version": "$1${version}"$2`,
    })));
    return true;
});
exports.commit = (octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    logger.startProcess('Committing...');
    if (misc_1.isCommitDisabled()) {
        logger.info('Commit is disabled.');
        return true;
    }
    const branch = misc_1.getDefaultBranch(context);
    if (undefined === branch) {
        logger.warn('Failed to get default branch name.');
        return false;
    }
    const tagName = getTagName(context);
    if (!(yield command_1.getBranchesByTag(tagName)).includes(branch)) {
        logger.info('This is not default branch.');
        return false;
    }
    const helper = new github_action_helper_1.ApiHelper(logger, { branch: branch, refForUpdate: `heads/${branch}` });
    return yield helper.commit(misc_1.getPackageDir(), misc_1.getCommitMessage(), [misc_1.getPackageFileName()], octokit, context);
});