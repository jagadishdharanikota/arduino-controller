/* Utility method file */

import readline from 'readline';

/**
 *
 * @param {string} argName - Name of the argument for which the value should be extracted
 */

function getProcessArgument(argName) {
  const argumentIndex = process.argv.indexOf(argName);
  if (argumentIndex !== -1) {
    return argumentIndex + 1 < process.argv.length ? process.argv[argumentIndex + 1] : '';
  }
  console.info(`Argument ${argName} is not provided during runtime`);
  return '';
}

function cliQuessionarie(questions = ['what is your name?', 'what is your qualification?']) {
  const answers = [];
  const askQuestion = (index) => {
    process.output(`\n${questions[index]}`);
  };

  process.stdin.on('data', (data) => {
    process.stdout.write(`\n${data}`);
    answers.push(data.trim());
    if (answers.length < questions.length) {
      askQuestion(answers.length);
    } else {
      process.exit();
    }
  });

  process.on('exit', () => {
    console.log('ThankYou for answering');
  });

  askQuestion(0);
}

function cliQuessionarieCompact(
  questions = ['what is your name?', 'what is your qualification?'],
  done
) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const collectAnswers = (allQuestions, onDone) => {
    const answers = [];
    const [firstQuestion] = allQuestions;

    const questionAnswered = (answer) => {
      answers.push(answer);
      if (answers.length < allQuestions.length) {
        rl.question(allQuestions[answers.length], questionAnswered);
      } else if (answers.length === allQuestions.length) {
        onDone(answers);
      }
    };
    rl.question(firstQuestion, questionAnswered);
  };

  collectAnswers(questions, done);
}

export { getProcessArgument, cliQuessionarie, cliQuessionarieCompact };
