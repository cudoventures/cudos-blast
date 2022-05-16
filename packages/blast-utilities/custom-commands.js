const { getCommands } = require('./config-utils')

let customTasks = []

function initCustomTasks() {
    const commands = getCommands()
    
    for (let i = 0; i < commands.length; i++) {
        let customTask = {
            command: commands[i].task.command,
            describe: commands[i].task.description,
            builder: (yargs) => {
                yargs.option('dir', {
                    type: 'string',
                    default: '.',
                    description: 'Project directory'
                })
                .version(false)
            },
            handler: commands[i].action
        }

        customTasks.push(customTask)
    }
      
  }

module.exports = { 
    initCustomTasks: initCustomTasks,
    customTasks: customTasks
}