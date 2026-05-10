export type CliOptions = {
  command?: string;
  targetPath: string;
  outPath?: string;
  jsonPath?: string;
  failOn: string[];
  redact: boolean;
  help: boolean;
  version: boolean;
};

export function parseCliArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    targetPath: '.',
    failOn: [],
    redact: true,
    help: false,
    version: false,
  };

  const positional: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    switch (token) {
      case '--out':
        options.outPath = argv[++index];
        break;
      case '--json':
        options.jsonPath = argv[++index];
        break;
      case '--fail-on':
        options.failOn = (argv[++index] ?? '').split(',').map((value) => value.trim()).filter(Boolean);
        break;
      case '--no-redact':
        options.redact = false;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--version':
      case '-v':
        options.version = true;
        break;
      default:
        if (token.startsWith('--')) {
          throw new Error(`Unknown option: ${token}`);
        }
        positional.push(token);
    }
  }

  options.command = positional[0];
  if (positional[1]) {
    options.targetPath = positional[1];
  }

  return options;
}
