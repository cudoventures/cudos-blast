
taskTemplate = {
  command: 'add',
  describe: 'Adds two number',
  builder: []
  // Function for your command
}

paramTemplate = {
  name: {
    describe: '',
    demandOption: true, // Required
    type: 'string'
  }
}
// const { command } = require('yargs')
const yargs = require('yargs')

let customTasks = []

class Task {

  constructor(name, description, opt) {

    this.task = {
      command: name,
      describe: description,
      builder: (yargs) => {
        // yargs.option("sm", {
        //   alias: "s",
        //   type: 'string',
        //   default: '0',
        //   description: 'kur directory'
        // })
        //   .version(false)
      },
      // handler: function (argv) {
      //   console.log('hello', argv.sm, 'sm kur')
    }


    // this.task = yargs.command(name, description)
    // this.task = taskTemplate
    // this.task.command = name
    // this.task.describe = description    
  }

  addParam = (name, description, alias, choices) => {
    this.task.option = (name, {
      alias: alias,
      describe: description,
      choices: choices
    })

    return this
  }

  setAction = (action) => {
    this.task.handler = function (argv) {
      console.log('hello', argv.sm, 'sm kur')

      // this.task.argv
      // console.log(JSON.stringify(this.task));

      // JSON.stringify(this.task).append(action)
      // console.log(this.task);

    }
    customTasks.push(this.task)

  }
}


task = (name, description) => {
  return new Task(name, description)
}

getTasks = () => {
  return customTasks
}

readTasks = () => {

}

module.exports = {
  task: task,
  getTasks: getTasks,
  readTasks: readTasks
}