/* eslint-disable no-undef */
const customTasks = []

class Task {
  constructor(name, description) {
    this.task = {
      command: name,
      describe: description,
      builder: {}
    }
  }

  addParam = (name, description, alias, type = 'string', demandOption = true, defaultValue = undefined) => {
    this.task.builder[name] = {
      description: description,
      alias: alias,
      type: type,
      demandOption: demandOption,
      default: defaultValue
    }

    return this
  }

  setAction = (action) => {
    this.task.handler = action

    customTasks.push(this.task)
  }
}

globalThis.task = (name, description) => {
  return new Task(name, description)
}

module.exports = {
  task: task,
  customTasks: customTasks
}
