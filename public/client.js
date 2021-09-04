
const socket = io();
const initTag = new InitTag();
const show_rooms = document.querySelector('#show_rooms');
const show_messages = document.querySelector('#show_messages');
const show_friends = document.querySelector('#show_friends');

//typing_mess
const form_typing_mess = document.querySelector('#form_typing_mess');
//typing_search_user
const search_user = document.querySelector('#search_user');
const search_user_result = document.querySelector('#search_user_result');
//modal_body_create_room
const input_create_room = document.querySelector('#input_create_room');
const btn_create_room = document.querySelector('#btn_create_room');
//modal_friend_reqs
const friend_reqs = document.querySelector('#friend_reqs');
const length_of_req = document.querySelector('#length_of_req');
//modal_add_member
const search_friend = document.querySelector('#search_friend');
const search_friend_result= document.querySelector('#search_friend_result');
const modal_add_member = document.querySelector('.modal_add_member');

//
const show_info = document.querySelector('#show_info');
const chat_header = document.querySelector('#chat_header');
const chat_header_right = document.querySelector('#chat_header_right');
//
// show_curr_room.style.display = 'none';
chat_header_right.style.display = 'none';
form_typing_mess.style.display = 'none';


const info={
    _id: JSON.parse(user_id.value),
    name: '',
    avatar:"",
    curRoom : '',
    befRoom :'',
}
// show_messages.addEventListener('scroll',()=>{
//     console.log( parseInt(show_messages.scrollTop));
//     childTag = show_messages.querySelector('.chat__sender');
//     console.log(childTag);
//     console.log("height: "+ childTag.offsetHeight);
   
// })

//init
socket.emit("init", info._id);
//obj{info};
socket.on('initInfo',(obj)=>{
    initTag.info(socket, info, show_info, obj);
})
//obj{room}
socket.on('initRoom',(obj)=>{
    initTag.room(socket, info, show_rooms, obj);
})
//obj{message};
socket.on('initMess',(obj)=>{
    initTag.mess(socket, info, obj, show_messages);
})
//obj{id, name, avatar} of friend
socket.on('initFriend',(obj)=>{
    initTag.friend(socket, info, show_friends, obj)
})
//obj{name, avatar, _id} of user
socket.on("initSearchUserResult",(obj)=>{
    initTag.userSearchResult(socket, info, search_user_result, obj);
})
//obj{name, avatar, _id} of user
socket.on("initSearchFriendResult",(obj)=>{
    initTag.friendSearchResult(socket, info, search_friend_result, obj);
})
socket.on('lengthOfReq',data=>{
    console.log(data);
    length_of_req.innerHTML = data
})
socket.on("initFriendReq",(obj)=>{
    initTag.friendReq(socket, info, friend_reqs, obj);
})
socket.on('online_status',obj=>{
    if(obj._id_2 === info._id){
        show_friends.querySelector(`#f${obj._id_1}`).setAttribute('style', 'background: rgb(49, 162, 76)');
        socket.emit('online_status', obj);
    }
})
socket.on('offline_status',obj=>{
    if(obj._id_2 === info._id){
        show_friends.querySelector(`#f${obj._id_1}`).setAttribute('style', 'background: #e60000');
    }
})
//obj{curRoom, _id, unSeenMess}
socket.on("updateUnSeenMess", obj=>{
    if(obj._id === info._id){
        if(obj.curRoom != info.curRoom){
            if(obj.unSeenMess !=0){
                document.querySelector(`#r${obj.curRoom}`).innerHTML = obj.unSeenMess;
            }
        }else{
            document.querySelector(`#r${obj.curRoom}`).innerHTML = '';
            socket.emit("updateUnSeenMess",{
                curRoom: obj.curRoom,
                _id: info._id,
            });
        }
    }
})
//accep_friend_req
socket.on('typing',()=>{
    
})
socket.on('onclick_friend', id=>{
    info.befRoom = info.curRoom;
    info.curRoom = id;
    socket.emit('onclick_room', info);
})
// typing_mess-submit;
// visibility: visible

//<<==============================>
form_typing_mess.addEventListener('submit',(e)=>{
    e.preventDefault();
    const inputText = form_typing_mess.querySelector('input').value.trim();
    form_typing_mess.querySelector('input').value= "";
    if(inputText){
        socket.emit('typing_mess-submit',({
            _id: info._id,
            name: info.name,
            avatar: info.avatar,
            content: inputText,
            curRoom: info.curRoom
        }));
    }
})
// MAKE FRIEND<<====================================>
//search_user-onkey
search_user.addEventListener('keyup',(e)=>{
    //remove all childNode
    while(search_user_result.firstChild){
        search_user_result.removeChild(search_user_result.firstChild);
    }

    const result = search_user.value.toLowerCase(); 
    if(result){ 
        socket.emit("search_user", {
            result: result,
            _id: info._id  
        });
    }
})
        //friend_req
socket.on("friendReqTrue",obj =>{
    if(obj.receiver === info._id){
        socket.emit("friendReqTrue",obj);
    }
})
socket.on("acceptFriendReqTrue",obj=>{
    if(obj.data === info._id){
        socket.emit('acceptFriendReqTrue', obj);
    }
})


//CREATE ROOM <====================================================>
//modal_create_room
btn_create_room.addEventListener('click',()=>{
    let input = input_create_room.value.trim();
    input_create_room.value = "";
    if(input != ''){
        socket.emit("create_room",{
            name: input,
            user: info._id
        });
    }
})

//add friend into room<===========================================>
    //search_friend-onkey
search_friend.addEventListener('keyup',(e)=>{
    //remove all childNode
    while(search_friend_result.firstChild){
        search_friend_result.removeChild(search_friend_result.firstChild);
    }

    const result = search_friend.value.toLowerCase(); 
    if(result){ 
        socket.emit("search_friend", {
            curRoom : info.curRoom,
            result: result,
            _id: info._id  
        });
    }
})
//obj{curRoom, _id} 
socket.on('add_to_room_true',(obj)=>{
    if(obj._id === info._id){
        socket.emit('add_to_room_true',obj);
    }
})