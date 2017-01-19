
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
    $('#delete-board-modal h4').text("Delete " + $(e.relatedTarget).parents().eq(2).siblings("input").val());
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
    $("#list-title").text($(e.target).val() + " Board List");
    $("#middle-div").css("display", "block");
    $("#new-list-button").attr("name", $(e.target).attr("id"));

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
    $('#edit-list-modal :input').val($(e.relatedTarget).parents().eq(2).siblings("input").val());
    $('#edit-list-modal :input').attr("id",$(e.relatedTarget).parents().eq(2).siblings("input").attr("id"));
    $('#edit-list-modal button').attr("id",$(e.relatedTarget).parents().eq(2).siblings("input").parent().attr("id"));
})

$('#editListForm').on('submit', function(e) {
    e.preventDefault();
    var values = {};
    values.key = $('#edit-list-modal input').attr("id");
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
    $('#delete-list-modal h4').text("Delete " + $(e.relatedTarget).parents().eq(2).siblings("input").val());
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
        },
        error: function (error) {
            console.log(error);
        }
    });
});


