import { Context } from '@actions/github/lib/context';
import { Utils } from '@technote-space/github-action-helper';
import { isValidTagName } from './utils/misc';

const {getTagName} = Utils;

export const DEFAULT_COMMIT_MESSAGE = 'feat: Update package version';
export const DEFAULT_PACKAGE_NAME = 'package.json';
export const DEFAULT_TEST_TAG_PREFIX = '';
export const TARGET_EVENTS = {
	'push': [
		(context: Context): boolean => isValidTagName(getTagName(context)),
	],
};