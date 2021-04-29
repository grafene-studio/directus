import * as path from 'path';

import { build } from 'gluegun';
import { command } from './core/command';
import { Toolbox } from './toolbox';
import { CommandResult } from './command';
import { CLIRuntimeError } from './core/exceptions';

export { command } from './core/command';
export type { Toolbox } from './toolbox';

export * from './command';
export * from './config';
export * from './events';
export * from './help';
export * from './options';
export * from './output';
export * from './toolbox';

export default async function <T extends any>(argv: string[], typescript: boolean = false): Promise<CommandResult<T>> {
	// create a runtime
	const runtime = build('directusctl')
		.exclude([
			'meta',
			'strings',
			'print',
			'filesystem',
			'semver',
			'system',
			'prompt',
			'http',
			'template',
			'patching',
			'package-manager',
		])
		.create();

	const loading = {
		state: true,
	};

	// Workaround stupid bug in gluegun
	// @ts-ignore
	const list = require('fs-jetpack/lib/list');
	const shimmer = require('shimmer');
	shimmer.wrap(list, 'sync', (original: Function) => {
		return function (this: any) {
			const result = original.apply(this, arguments);
			if (!loading.state) {
				return result;
			}

			return result.filter((file: string) => {
				if (!typescript) {
					if (file.endsWith('.ts')) {
						return false;
					}
				}
				return !file.endsWith('.d.ts') && !file.endsWith('.ts.map');
			});
		};
	});

	// no exclusions
	runtime.addDefaultPlugin(path.join(__dirname, 'cli'), {
		name: 'directus',
		hidden: false,
	});

	runtime.addPlugin('./node_modules/directus/dist/cli/new', {
		name: 'directus-server',
		hidden: false,
		required: false,
	});

	const extensions = ['config', 'events', 'options', 'output', 'query', 'instances', 'help'];
	extensions.forEach((extension) =>
		runtime.addExtension(extension, require(path.join(__dirname, `core/extensions/${extension}`)))
	);

	if (process.env.ENABLE_COMMUNITY_EXTENSIONS) {
		runtime.addPlugins('./node_modules', { matching: 'directus-cli-*', hidden: false });
		runtime.addPlugins('./node_modules', { matching: 'directus-*-cli', hidden: false });
		runtime.addPlugins('./node_modules', { matching: '@directus/*-cli', hidden: false });
		runtime.addPlugins('./node_modules', { matching: '@directus/cli-*', hidden: false });
	}

	const extensionsDir = path.resolve(process.env.EXTENSIONS_PATH ?? './extensions', 'cli');
	runtime.addPlugin(extensionsDir, {
		name: 'directus-project',
		hidden: false,
		required: false,
	});

	// add a default command first
	runtime.defaultCommand = command(
		{
			disableHelp: true,
		},
		async function ({ help, parameters: { array } }: Toolbox) {
			await help.displayHelp();
			if (array && array.length) {
				throw new CLIRuntimeError(`Unknown command: ${array.join(' ')}`);
			}
		}
	) as any;

	loading.state = false;

	const commandResult: CommandResult<T> = {};

	try {
		const { result, output } = await runtime.run(argv);
		commandResult.help = result.help;
		commandResult.result = result.data;
		commandResult.error = result.error;
		commandResult.output = output;
	} catch (err) {}

	return commandResult;
}
