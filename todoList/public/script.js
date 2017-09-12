console.log("Is Script File Loading");
const RESPONSE_DONE = 4;
const STATUS_OK = 200;
const TODOS_LIST_ID = "todos_list_div";
const TODOS_COMP_ID = "todos_comp_div";
const TODOS_DEL_ID = "todos_del_div";
const NEW_TODO_INPUT_ID = "new_todo_input";

window.onload = getTodosAJAX();

function addTodoElements(id, todos_data_json){

    var todos = JSON.parse(todos_data_json);

    var parent = document.getElementById(id);
    parent.innerHTML = "";

    if (parent){
      Object.keys(todos).forEach(

            function(key) {
                var todo_element = createTodoElement(key, todos[key],id);
                parent.appendChild(todo_element);
            }
        )
    }
}


function createTodoElement(id, todo_object,r_id){

    var todo_element = document.createElement("div");

    if (todo_object.status == "ACTIVE"&&r_id==TODOS_LIST_ID){

        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = todo_object.title;
        checkbox.setAttribute("onclick", "completeTodoAJAX("+id+")");


        var label = document.createElement('label');
        label.appendChild(document.createTextNode(todo_object.title));
        todo_element.appendChild(checkbox);
        todo_element.appendChild(label);
        todo_element.setAttribute(
            "data-id", id
        );

        todo_element.setAttribute(
            "class", "todoStatus"+ todo_object.status + " " + "breathVertical"
        );

        var complete_button = document.createElement("button");
        complete_button.innerText = "X";
        complete_button.setAttribute("aria-label", "Close");
        complete_button.setAttribute("class", "breathHorizontal");
        complete_button.setAttribute("onclick", "deleteTodoAJAX("+id+")");

        todo_element.appendChild(complete_button);
    }
    if (todo_object.status == "COMPLETE"&&r_id==TODOS_COMP_ID){

        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = todo_object.title;
        checkbox.checked=true;


        var label = document.createElement('label');
        label.appendChild(document.createTextNode(todo_object.title));
        todo_element.appendChild(checkbox);
        todo_element.appendChild(label);
        todo_element.setAttribute(
            "data-id", id
        );

        todo_element.setAttribute(
            "class", "todoStatus"+ todo_object.status + " " + "breathVertical"
        );
        var complete_button = document.createElement("button");
        complete_button.innerText = "X";
        complete_button.setAttribute("aria-label", "Close");
        complete_button.setAttribute("class", "breathHorizontal");
        complete_button.setAttribute("onclick", "deleteTodoAJAX("+id+")");

        todo_element.appendChild(complete_button);
    }
    if (todo_object.status == "DELETED"&&r_id==TODOS_DEL_ID){

        todo_element.innerHTML = todo_object.title;
        // HW: Read custom data-* attributes

        todo_element.setAttribute(
            "class", "todoStatus"+ todo_object.status + " " + "breathVertical"
        );
    }
    return todo_element;
}
function getTodosAJAX(){

    var xhr = new XMLHttpRequest();
    //
    xhr.open("GET", "/api/todos", true);

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE){

            if(xhr.status == STATUS_OK){
                console.log(xhr.responseText);
                addTodoElements(TODOS_LIST_ID, xhr.responseText);
                addTodoElements(TODOS_DEL_ID, xhr.responseText);
                addTodoElements(TODOS_COMP_ID, xhr.responseText);
            }
        }
    }// end of callback
    xhr.send(data=null);

}

function addTodoAJAX(){

    var title= document.getElementById(NEW_TODO_INPUT_ID).value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/todos", true);
    xhr.setRequestHeader(
        "Content-type", "application/x-www-form-urlencoded");

    var data = "todo_title=" + encodeURI(title);

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements(TODOS_LIST_ID, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}


function completeTodoAJAX(id){

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data = "todo_status=COMPLETE";

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements(TODOS_COMP_ID, xhr.responseText);
                getTodosAJAX();
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);

}

function deleteTodoAJAX(id){

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data = "todo_status=DELETED";

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements(TODOS_DEL_ID, xhr.responseText);
                getTodosAJAX();
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);

}