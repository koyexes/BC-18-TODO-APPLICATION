/**
 * Created by koyexes on 1/18/2017.
 */
var newBoard=  (id, title) => {
   return `<div  style="margin-bottom: 5px;" class="input-group new-board">
      <input id="${id}" type="button" value="${title}"  class="boards form-control btn btn-primary"  onclick="boardListener()" >
      <span class="input-group-btn dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" >
               <span class="glyphicon glyphicon-option-horizontal"></span>
         </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
            <li><a role="button" data-toggle="modal" data-target="#edit-board-modal" >Edit Title</a></li>
            <li><a role="button" data-toggle="modal" data-target="#delete-board-modal" data-toggle="modal">Delete</a></li>
          </ul>
      </span>
    </div>`;
};

var newList=  (boardKey, id, title) => {
   return `<div id="${boardKey}" style="margin-bottom: 5px;" class="input-group new-board">
      <input id="${id}" type="button" value="${title}" class="boards form-control btn btn-primary" onclick="listListener()" >
      <span class="input-group-btn dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" >
               <span class="glyphicon glyphicon-option-horizontal"></span>
         </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
            <li><a role="button" data-toggle="modal" data-target="#edit-list-modal" data-toggle="modal">Edit Title</a></li>
            <li><a role="button"  data-target="#delete-list-modal" data-toggle="modal">Delete</a></li>
          </ul>
      </span>
    </div>`;
};

var newTask=  (boardKey, listKey,  id, title) => {
   return `<div class="row">
              <div class="col-lg-6">
                <div class="input-group">
                  <span class="input-group-addon">
                    <input type="checkbox" aria-label="...">
                  </span>
                  <h3>${title}</h3>
                </div>
           </div>`;
};


