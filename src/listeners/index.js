import runBobaCommands from './boba.js';
import runCarCommands from './car.js';
import runFisiCommands from './fisi.js';
import runHelperCommands from './helper.js';
import runLunchCommands from './lunch.js';
import runRubbishCommands from './rubbish.js';

export default () => {
  runBobaCommands();
  runCarCommands();
  runFisiCommands();
  runHelperCommands();
  runLunchCommands();
  runRubbishCommands();
};
