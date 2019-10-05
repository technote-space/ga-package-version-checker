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
const path_1 = __importDefault(require("path"));
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const filter_github_action_1 = require("@technote-space/filter-github-action");
const github_action_helper_1 = require("@technote-space/github-action-helper");
const package_1 = require("./utils/package");
const constant_1 = require("./constant");
const { showActionInfo } = github_action_helper_1.Utils;
/**
 * run
 */
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const logger = new github_action_helper_1.Logger();
            showActionInfo(path_1.default.resolve(__dirname, '..'), logger, github_1.context);
            if (!filter_github_action_1.isTargetEvent(constant_1.TARGET_EVENTS, github_1.context)) {
                logger.info('This is not target event.');
                return;
            }
            if (yield package_1.updatePackageVersion(github_1.context)) {
                yield package_1.commit(new github_1.GitHub(core_1.getInput('GITHUB_TOKEN', { required: true })), github_1.context);
            }
        }
        catch (error) {
            core_1.setFailed(error.message);
        }
    });
}
run();
