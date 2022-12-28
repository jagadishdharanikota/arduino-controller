const processArgs = process.argv;
console.info(`pm2 starting with arguments:`, processArgs);
const isDebuggableDevEnvironment = processArgs.findIndex((item) => item === 'development_debug');
const isDevEnvironment = processArgs.findIndex((item) => item === 'development');
let mode;
let instances = 1;

const Color = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
};

if (isDebuggableDevEnvironment > 0) {
  const seperatorLine = ' ' + '-'.repeat(156);
  const InfoMsg =
    " | Starting the service in debug enabled mode. Attach to the process for debugging by using 'Attach by Process ID' vscode configuration to access the server. |";
  console.info(Color.BgRed, seperatorLine);
  console.info(InfoMsg);
  console.info(Color.BgRed, seperatorLine, Color.Reset);

  // pm2 should be run in fork mode to attach the process for debugging
  mode = 'fork';
} else if (isDevEnvironment > 0) {
  mode = 'cluster';
} else {
  mode = 'cluster';
  // Ref: https://www.udemy.com/course/advanced-node-for-developers/learn/lecture/9646774#overview
  instances = 0; // pm2 will decide how many instances to spun off based on the logical cores of the machine
}

module.exports = {
  apps: [
    {
      name: 'server',
      script: './src/server.js',

      // Option for debugging the node process running in pm2 with vscode attach process launch configuration
      // Use either this option or the once specified in env object NODE_OPTIONS
      // Important Note :  While debugging it is important to run the pm2 in "fork" mode. With cluster mode we cannot find the process to attach for debugging
      // With this option you cannot access routes unless debugger is attached and will be applicable for server ran in all mode
      //node_args: ["--inspect-brk"],

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: 'one two',
      instances: instances,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      time: true,
      ignore_watch: ['node_modules'],
      wait_ready: true,
      exec_mode: mode,
      // Requires dotenv/config and loads .env file configuration into environment variables
      node_args: '-r dotenv/config',
      env: {
        // These environment variable are available for server ran in any mode. For environment specific variable mention in its env object

        // Option for debugging the node process running in pm2 with vscode attach process launch configuration
        // Important Note :  While debugging it is important to run the pm2 in "fork" mode. With cluster mode we cannot find the process to attach for debugging.
        // This option will be applicable for server ran in any mode. To specify for specific mode give this option in its corresponding env object like env_development_debug
        // NODE_OPTIONS: '--inspect-brk',

        PORT: 8000,
        MONGODB_URI: 'mongodb://localhost:27017/appinno',
        NODE_ENV: 'development',
      },
      env_development_debug: {
        // --inspect-brk : Option to attach debugger and debug using vscode Attach by Process ID configuration
        // --trace-sync-io : Prints a stack trace whenever synchronous I/O is detected after the first turn of the event loop.
        // Ref: https://expressjs.com/en/advanced/best-practice-performance.html
        // --throw-deprecation : Throw errors for deprecations.
        NODE_OPTIONS: '--inspect-brk --trace-sync-io --trace-warnings --throw-deprecation',
        NODE_ENV: 'development',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
};
