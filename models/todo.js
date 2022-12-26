'use strict';
const {
  Model,Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params){
      return await Todo.create(params);
    }
    static async showList(){
      console.log("My Todo list \n");
      console.log("OverDue");
      const overduelist=await Todo.overdue();
      console.log(overduelist.map((data)=> data.displayableString()).join("\n"));
      console.log("\n");
      console.log("Due Today");
      const dueTodaylist = await Todo.dueToday();
			console.log(
				dueTodaylist.map((data) => data.displayableString()).join("\n")
			);
			console.log("\n");
      console.log("Due Later");
      const dueLaterlist = await Todo.dueLater();
			console.log(
				dueLaterlist.map((data) => data.displayableString()).join("\n")
			);
    }
    static async overdue(){
      return Todo.findAll({
        where:{
          dueDate:{[Op.lt]:new Date(),},
        },
      });
    }
    static async dueToday(){
      return Todo.findAll({
        where:{
          dueDate:{[Op.eq]:new Date(),},
        },
        order: [['id','ASC']],
      });
    }
    static async dueLater(){
      return Todo.findAll({
        where:{
          dueDate:{[Op.gt]:new Date(),},
        },
        order: [['id','ASC']],
      });
    }
    static async markAsComplete(id){
      return await Todo.update(
        {completed:true},
        {where :{id: id,},}
      );
    }
    displayableString(){
      let checkbox = this.completed ? "[x]" : "[ ]";
			return `${this.id}. ${checkbox} ${this.title}${this.dueDate === new Date().toLocaleDateString("en-CA") ? "": ` ${this.dueDate}`}`;
    }
    static associate(models) {
      // define association here
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};