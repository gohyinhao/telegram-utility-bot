import runBobaCommands from './boba.js';
import runCallbackQueryCommands from './callbackQuery.js';
import runCarCommands from './car.js';
import runFisiCommands from './fisi.js';
import runHelperCommands from './helper.js';
import runLunchCommands from './lunch.js';
import runReminderCommands from './reminder.js';
import runRubbishCommands from './rubbish.js';

export default () => {
  runBobaCommands();
  runCallbackQueryCommands();
  runCarCommands();
  runFisiCommands();
  runHelperCommands();
  runLunchCommands();
  runReminderCommands();
  runRubbishCommands();
};
