(()=>{"use strict";class e{constructor(e,t,s){this.name=e,this.description=t,this.tasks=s}getTasks(){return this.tasks}addTask(e){const s=new t(e);this.tasks.push(s)}}class t{constructor(e,t,s,i=0){this.name=e,this.description=t,this.dueDate=s?new Date(s):new Date,this.done=!1,this.priority=0}getName(){return this.name}getDescription(){return this.description}getDueDate(){return this.dueDate}getDone(){return this.done}getPriority(){return this.priority}setDone(e){this.done=e}setPriority(e){e>=0&&e<=5?this.priority=e:console.error("error: priority must be between 0 and 5")}}let s=[];window.onload=()=>{const i=new t("Buy milk","Buy milk for the family",new Date("2020-01-01")),r=new t("Buy eggs","Buy eggs for the family",new Date("2020-01-01")),o=new t("Buy bread","Buy bread for the family",new Date("2020-01-01")),n=new e("Family","This is the family project",[i,r,o]),a=new e("Work","This is the work project",[i,r,o]);s.push(n),s.push(a),console.log(s),n.addTask("Buy milk"),console.log(n.getTasks()),console.log(a.getTasks())}})();