const customTasks = []

class Task {
  constructor(name, description) {
    this.task = {
      command: name,
      describe: description,
      builder: {}
    }
  }

  addParam = (name, description, alias) => {
    this.task.builder[name] = {
      description: description,
      alias: alias,
      type: 'string',
      demandOption: true
    }

    return this
  }

  setAction = (action) => {
    this.task.handler = action

    customTasks.push(this.task)
  }
}

const task = (name, description) => {
  return new Task(name, description)
}

module.exports = {
  task: task,
  customTasks: customTasks
}
