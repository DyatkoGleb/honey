let blockСomments = document.getElementById('block-comments'),
    btnAddComment = document.getElementById('btn-add-comment'),
    inputName = document.getElementById('input-name'),
    inputEmail = document.getElementById('input-email'),
    inputText = document.getElementById('input-text'),
    errorBox = document.getElementById('error-box'),
    backUrl = './back/lib.php',
    commentCount = 0,
    delayHideError



window.onload = () => {
    $.ajax({
        url: backUrl,
        type: 'post',
        data: {request: 'checkConnectDB'},
        success: (data) => {
            data = JSON.parse(data)

            if (data['result'] == false) {
                error(data['error'])
            } else {
                loadCommentList()
            }
        }
    })
}

function loadCommentList() {
    $.ajax({
        url: backUrl,
        type: 'post',
        data: {request: 'loadCommentList'},
        success: (data) => {
            data = JSON.parse(data)

            if (data['result'] == false) {
                error(data['error'])
            } else {
                addCommentList(data['comments'])
            }
        }
    })
}

function addCommentList(data) {
    data.forEach(comment => {
        blockСomments.append(createCommentElement(comment))
        commentCount++
    })
}

function createCommentElement(comment) {
    console.log(comment)
    let col = document.createElement('div'),
        card = document.createElement('div'),
        cardHead = document.createElement('div'),
        name = document.createElement('div'),
        cardBody = document.createElement('div'),
        email = document.createElement('div'),
        text = document.createElement('div')


    col.classList = 'col-12 col-md-6 col-lg-4 mb-4'

    card.classList = commentCount % 2 == 0 ? 
    'card-comment card-comment-blue h-100' : 'card-comment card-comment-green h-100'

    cardHead.classList = 'card-head'

    name.classList = 'name text-center text-white p-2'
    name.innerText = comment['name']

    cardBody.classList = 'card-body'

    email.classList = 'email text-center mb-3'
    email.innerText = comment['email']

    text.classList = 'text-comment text-center'
    text.innerText = comment['text']


    cardHead.append(name)
    cardBody.append(email, text)
    card.append(cardHead, cardBody)
    col.append(card)


    return col
}

function addNewComment() {
    if (validationFormNewComment()) {
        console.log()
        $.ajax({
            url: backUrl,
            type: 'post',
            data: {
                request: 'addNewComment',
                name: inputName.value, 
                email: inputEmail.value, 
                text: inputText.value
            },
            success: (data) => {
                data = JSON.parse(data)

                if (data['result'] == false) {
                    error(data['error'])
                } else {
                    blockСomments.append(createCommentElement({
                        'name': inputName.value, 
                        'email': inputEmail.value, 
                        'text': inputText.value, 
                    }))
                    commentCount++
                }
            }
        })
    }
}

function validationFormNewComment() {
    if (inputName.value && (email = inputEmail.value) && inputText.value != '') {
        let reg = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i

        if (reg.test(email)) {
            return true
        } else {
            error('Неправильный Email')
        }
    } else {
        error('Не все обязательные поля были заполнены')
    }
}

btnAddComment.addEventListener('click', () => addNewComment()) 



function error(text, e) {
    if (e && e.id == 'error-box') {
        hideError()
    } else {
        errorBox.classList.remove('d-none')
        errorBox.innerHTML = text + ' ' + '<i class="fa fa-times" aria-hidden="true"></i>'

        clearInterval(delayHideError)
        delayHideError = setInterval(() => {
            hideError()
        }, 4000)
    }
}
function hideError() {
    clearInterval(delayHideError)
    errorBox.classList.add('d-none')
}