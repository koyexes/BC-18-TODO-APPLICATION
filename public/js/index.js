$(document).on('ready', function (e) {
    var uid = $('#userId').val();
     $.ajax({
        type: 'GET',
        data: {},
        contentType: 'application/json',
        url: 'board/all/' + uid,
        success: function (data) {
           for (var key in data) {
                if (!data.hasOwnProperty(key)) continue;
                var obj = data[key];
                for (var prop in obj) {
                    if(!obj.hasOwnProperty(prop)) continue;
                    if (prop === "title") {
                        $('#board-list-div').append(newBoard(key, obj[prop]));
                    }

                }
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
});
$('#loginForm').on('submit', function(e) {
    e.preventDefault();
    var values = {};
    $('#loginForm :input').each(function () {
        values[this.name] = $(this).val();
    });
    $.ajax({
        type: 'POST',
        data: JSON.stringify(values),
        contentType: 'application/json',
        url: '/login',
        success: function (data) {
            $('#loginModal').modal('hide');
            window.location.href = '/home';
        },
        error: function (error) {
            console.log(error);
        }
    });

})

//creates board
$('#createBoardForm').on('submit', function(e) {
    e.preventDefault();
    var values = {};
    $('#createBoardForm :input').each(function () {
        values[this.name] = $(this).val();
    });
    $.ajax({
        type: 'POST',
        data: JSON.stringify(values),
        contentType: 'application/json',
        url: '/board',
        success: function (data) {
            $('#create-board-modal').modal('hide');
            $('#board-list-div').append(newBoard(data.key, data.title));
        },
        error: function (error) {
            console.log(error);
        }
    });

});

$('#edit-board-modal').on('show.bs.modal', (e) => {
    $('#edit-board-modal :input').val($(e.relatedTarget).parents().eq(2).siblings("input").val());
    $('#edit-board-modal :input').attr("id",$(e.relatedTarget).parents().eq(2).siblings("input").attr("id"));
})

$('#editBoardForm').on('submit', function(e) {
    e.preventDefault();
    var values = {};
    $('#editBoardForm :input').each(function () {
        values[this.name] = $(this).val();
    });
    values.key = $('#editBoardForm :input').attr("id");
    $.ajax({
        type: 'PUT',
        data: JSON.stringify(values),
        contentType: 'application/json',
        url: '/board',
        success: function (data) {
            $('#edit-board-modal').modal('hide');
            $('#board-list-div ' + 'div input#'+values.key).val(values.title);
        },
        error: function (error) {
            console.log(error);
        }
    });
});

// this function make changes to the delete modal
$('#delete-board-modal').on('show.bs.modal', (e) => {
    $('#delete-board-modal h4').attr("id",$(e.relatedTarget).parents().eq(2).siblings("input").attr("id"));
    $('#delete-board-modal h4').text("Delete " + $(e.relatedTarget).parents().eq(2).siblings("input").val() + " List");
});

// this function deletes a board
$('#delete-board-modal button#deleteBoardButton').on('click', () => {
     var key = $('#delete-board-modal h4').attr("id");
     $.ajax({
        type: 'DELETE',
        data: {},
        contentType: 'application/json',
        url: '/board/' + key,
        success: function (data) {
            $('#delete-board-modal').modal('hide');
            $('#board-list-div ' + 'input#'+key).parent().remove();
            $('#list-div ' + 'div#'+ key).remove();
            $("#middle-div").css("display", "none");
        },
        error: function (error) {
            console.log(error);
        }
    });
});

// this function listens to click events of all boards
var boardListener = function () {
    var e = window.event;
    var boardKey = $(e.srcElement).attr('id').toString();
    $("#list-title").text($(e.target).val().toUpperCase() + " Cards".toUpperCase());
    $('#list-div').empty();
    $("#new-list-button").attr("name", $(e.target).attr("id"));
     $.ajax({
        type: 'GET',
        data: {},
        contentType: 'application/json',
        url: 'board/' + boardKey + '/list',
        success: function (data) {
            for (var key in data) {
                if (!data.hasOwnProperty(key)) continue;
                var obj = data[key];
                for (var prop in obj) {
                    if(!obj.hasOwnProperty(prop)) continue;
                    if (prop === "title") {
                        $('#list-div').append(newList(boardKey, key, obj[prop]));
                    }

                }
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
     $("#middle-div").css("display", "block");
     $("#right-div").css("display", "none");

};

// this function make changes to the create list modal
$('#create-list-modal').on('show.bs.modal', (e) => {
    $('#create-list-modal button').attr("id",$(e.relatedTarget).attr("name"));
});

// this function creates a list for a board
$('#createListForm').on('submit', function(e) {
    e.preventDefault();
    var values = {};
    values.boardKey = $('#createListForm button').attr("id");
    $('#createListForm :input').each(function () {
        values[this.name] = $(this).val();
    });
    $.ajax({
        type: 'POST',
        data: JSON.stringify(values),
        contentType: 'application/json',
        url: '/list',
        success: function (data) {
            $('#create-list-modal').modal('hide');
            $('#list-div').append(newList(values.boardKey,data.key, data.title));
        },
        error: function (error) {
            console.log(error);
        }
    });

});

$('#edit-list-modal').on('show.bs.modal', (e) => {
    $('#edit-list-modal input[name = title]').val($(e.relatedTarget).parents().eq(2).siblings("input").val());
    $('#edit-list-modal input[name = title]').attr("id",$(e.relatedTarget).parents().eq(2).siblings("input").attr("id"));
    $('#edit-list-modal button').attr("id",$(e.relatedTarget).parents().eq(2).siblings("input").parent().attr("id"));
})

$('#editListForm').on('submit', function(e) {
    e.preventDefault();
    var values = {};
    values.key = $('#edit-list-modal input[name = title]').attr("id");
    values.boardKey = $('#edit-list-modal button').attr("id");
    $('#editListForm :input').each(function () {
        values[this.name] = $(this).val();
    });
    $.ajax({
        type: 'PUT',
        data: JSON.stringify(values),
        contentType: 'application/json',
        url: '/list',
        success: function (data) {
            $('#edit-list-modal').modal('hide');
            $('#list-div ' + 'div input#'+values.key).val(values.title);
        },
        error: function (error) {
            console.log(error);
        }
    });

});

// this function make changes to the delete modal
$('#delete-list-modal').on('show.bs.modal', (e) => {
    $('#delete-list-modal h4').text("Delete " + $(e.relatedTarget).parents().eq(2).siblings("input").val() + " Card");
    $('#delete-list-modal h4').attr("id",$(e.relatedTarget).parents().eq(2).siblings("input").attr("id"));
    $('#delete-list-modal button').attr("id",$(e.relatedTarget).parents().eq(2).siblings("input").parent().attr("id"));

});

$('#delete-list-modal button#deleteListButton').on('click', () => {
    var values = {};
    values.boardKey = $('#delete-list-modal button').attr("id");
    values.key = $('#delete-list-modal h4').attr("id");
    $.ajax({
        type: 'DELETE',
        data: JSON.stringify(values),
        contentType: 'application/json',
        url: '/list/' + values.key,
        success: function (data) {
            $('#delete-list-modal').modal('hide');
            $('#list-div ' +  'input#'+values.key).parent().remove();
            $("#right-div").css("display", "none");
        },
        error: function (error) {
            console.log(error);
        }
    });
});

var listListener = function () {
    var e = window.event;
    console.log(e);
    var boardKey = $(e.srcElement).parent().attr('id').toString();
    var listKey = $(e.srcElement).attr('id').toString();
    $("#task-title").text($(e.target).val().toUpperCase() + " Tasks".toUpperCase());
    $('#task-div').empty();
    $("#new-task-button").attr("name", $(e.target).attr("id"));
    $('#task-board-id').val(boardKey);
    $.ajax({
        type: 'GET',
        data: {},
        contentType: 'application/json',
        url: 'board/' + boardKey + '/list/' + listKey,
        success: function (data) {
            for (var key in data) {
                if (!data.hasOwnProperty(key)) continue;
                var obj = data[key];
                for (var prop in obj) {
                    if(!obj.hasOwnProperty(prop)) continue;
                    if (prop === "title") {
                        $('#task-div').append(newTask(boardKey, listKey, key, obj[prop]));
                    }
                }
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
    $("#right-div").css("display", "block");
};
$('#create-task-modal').on('show.bs.modal', (e) => {
    $('#create-task-modal button').attr("id",$(e.relatedTarget).attr("name"));
});


$('#createTaskForm').on('submit', function(e) {
    e.preventDefault();
    var values = {};
    values.boardKey = $('#task-board-id').val();
    values.listKey = $('#createTaskForm button').attr("id");
    $('#createTaskForm :input').each(function () {
        values[this.name] = $(this).val();
    });
    $.ajax({
        type: 'POST',
        data: JSON.stringify(values),
        contentType: 'application/json',
        url: '/task',
        success: function (data) {
            $('#create-task-modal').modal('hide');
            $('#task-div').append(newTask(values.boardKey,values.listKey,data.key, values.title));
        },
        error: function (error) {
            console.log(error);
        }
    });

});

var deleteTask = () => {
    var e = window.event;
    $.ajax({
        type: 'DELETE',
        data: {},
        contentType: 'application/json',
        url: $(e.srcElement).attr('name'),
        success: function (data) {
            $('div#'+data).remove();
        },
        error: function (error) {
            console.log(error);
        }
    });

};

var updateTaskTitle = () => {
    var e = window.event;
    var values = {};
    values.title = $(e.srcElement).val();
    $.ajax({
        type: 'PUT',
        data: JSON.stringify(values),
        contentType: 'application/json',
        url: $(e.srcElement).attr('name'),
        success: function (data) {
            $(e.srcElement).val(data);
        },
        error: function (error) {
            console.log(error);
        }
    });

};


var taskDone = () => {
    var e = window.event;
    console.log(e);
    var values = {};
    values.completed = $(e.srcElement).is(':checked');
    $.ajax({
        type: 'PUT',
        data: JSON.stringify(values),
        contentType: 'application/json',
        url: $(e.srcElement).attr('name'),
        success: function (data) {
            $(e.srcElement).css('background-color', "green");
        },
        error: function (error) {
            console.log(error);
        }
    });

};

var signUp = function () {
    var values = {};
     $('#signupForm :input').each(function () {
        values[this.name] = $(this).val();
    });
     console.log(values);
    $.ajax({
        type: 'POST',
        data: JSON.stringify(values),
        contentType: 'application/json',
        url: '/signup',
        success: function (data) {
            $('#signUpModal').modal('hide');
            alert("Registration Successful, Login in with your details");
            $('#loginModal').modal('show');
        },
        error: function (error) {
            alert('User Already Exist');
            console.log(error);
        }
    });
};

//
// var boardKey = $(e.relatedTarget).parents().eq(2).siblings("input").parent().attr('id');
//     var key = $(e.relatedTarget).parents().eq(2).siblings("input").attr('id');
//     var values  = {};
//     values.boardKey = boardKey.toString();
//      console.log(boardKey, key);
//      $.ajax({
//         type: 'GET',
//         data: values,
//         contentType: 'application/json',
//         url:  '/list/' + key.toString(),
//         success: function (data) {
//             console.log(data);
//         },
//         error: function (error) {
//             console.log(error);
//         }
//     });