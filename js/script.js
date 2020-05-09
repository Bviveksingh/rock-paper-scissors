

hide_elements();
let initialise = initialise_commands();
let score = score_count();
bind_score();



function bind_score(){
    let cookie_function = cookie();
    let score_view_element = document.getElementById('score');
    if(!check_cookie()){
       score_view_element.innerHTML = 0;
    }
    else{
        let cookie = get_cookie();
        score_view_element.innerHTML = cookie;
    }

    function get_cookie(cookie_name=cookie_function.get_name()){
        let cookies = document.cookie.split(";");
    
        for(let i = 0; i < cookies.length; i++) {
            let cookiePair = cookies[i].split("=");
            
            if(cookie_name == cookiePair[0].trim()) {
                return cookiePair[1];
            }
        }
    
        return null;
    }
    
    function check_cookie(){
        let cookie = get_cookie();
        if(!cookie) return false;
        else return true;
    }

}


function cookie(){
    let cookie_name = "score_cookie";
    return {
        get_name : () => cookie_name
    }
}


function initialise_commands(){
    let reference = {paper:0, scissors:1, rock:2};
    
    let result_reference = {"1": "YOU WIN","-1": "YOU LOSE", "0": "TIE"};
    
    return{
        commands : () => ([
            {name:Object.keys(reference)[reference.paper],value:reference.paper, 1:1, 2:0},
            {name:Object.keys(reference)[reference.scissors],value:reference.scissors,0:0, 2:1},
            {name:Object.keys(reference)[reference.rock],value:reference.rock,0:1,1:0}]),
        
        get_reference : (number) => Object.keys(reference)[number],
        
        get_result_reference : (number) => result_reference[number]
    }

}

function score_count(){
    let score = 0;
    
    let change = (result_score) => {
        if(score === 0 && result_score < 0) return;
        else score+=result_score;
    }

    return {
        change:change,
        value: () => score
    }
}



async function start_duel(user_command){
    toggle_display('action-section-duel','grid');
    let display_user = await display_user_command(user_command);
    if(display_user) toggle_display('action-section-result','flex');
    let computer_command = await display_computer_command();
    let computed_result = await compute_result(user_command,computer_command);
    let displaying_result = await display_result(computed_result);
    let display_radial = await display_radial_background(computed_result);
    let changed_score = await change_score(computed_result);
    set_cookie(changed_score);
 
}

function display_user_command(user_command){
    return new Promise((resolve)=>{
            let user_command_reference = initialise.get_reference(user_command);
            
            let element = document.getElementById('user-result');
            element.classList.remove(element.classList[1]);
            element.classList.add(`result-${user_command_reference}`);
            
            let svg_element = element.getElementsByClassName('result-svg')[0];
            svg_element.classList.remove(svg_element.classList[1]);
            svg_element.classList.add(`${user_command_reference}`);
            toggle_display('dark-background-container','flex');

            resolve(true);
    })
  
}

function display_computer_command(){
    return new Promise((resolve)=>{
            setTimeout(()=>{
                toggle_display('dark-background-container','flex');
                toggle_display('computer-result','flex');
                let all_computer_commands = initialise.commands();
                let random_number = Math.floor(Math.random() * all_computer_commands.length); 
                let computer_command = all_computer_commands.filter(element => element.value === random_number).shift();
            
                let element = document.getElementById('computer-result');
                element.classList.remove(element.classList[1]);
                element.classList.add(`result-${computer_command["name"]}`);
                
                let svg_element = element.getElementsByClassName('result-svg')[0];
                svg_element.classList.remove(svg_element.classList[1]);    
                svg_element.classList.add(`${computer_command["name"]}`);
                resolve(computer_command);
            },1000);
    });
}

function compute_result(user_command,computer_command){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            let result;
            if(user_command === computer_command.value) result = 0;
            else{
                if(computer_command[user_command] == 1) result = 1;
                if(computer_command[user_command] == 0) result = -1;
            }
            resolve(result);
        },500);
    })
}

function display_result(result){
    return new Promise((resolve)=>{
        let element = document.getElementById('result-text');
        element.innerHTML = initialise.get_result_reference(result);
        toggle_display('main-result','block');
        resolve(true);
    })
}

function display_radial_background(result){
    return new Promise((resolve)=>{
        if(result === 1) toggle_display('user-radial-background', 'block')
        else if(result === -1) toggle_display('computer-radial-background', 'block');
        else return;
        resolve(true);
    })
}

function change_score(result){
   return new Promise((resolve)=>{
        score.change(result);
        let score_view_element = document.getElementById('score');
        score_view_element.innerHTML = score.value();
        resolve(score.value());
   })
}

function set_cookie(computed_result){
    let cookie_name = "score_cookie";
    document.cookie = cookie_name + "=" + computed_result;
}


function play_again(){
    toggle_display('action-section-result','flex');
    toggle_display('action-section-duel','grid');
    toggle_display('main-result','flex');
    toggle_display('computer-result','flex');
    hide_radial_backgrounds();
}

function hide_radial_backgrounds(){
    let elements = document.getElementsByClassName('radial-background');
    for(let i = 0; i < elements.length; i++){
        elements[i].style.display = "none";
    }
}

function hide_elements(){
    toggle_display('rules-section','flex');
    toggle_display('action-section-result','flex');
    toggle_display('main-result','flex');
    toggle_display('user-radial-background', 'block');
    toggle_display('computer-radial-background', 'block');
    toggle_display('computer-result','flex');
    toggle_display('dark-background-container','flex');
}

function toggle_rules_block(number){
    
    let element = document.getElementById('rules-section');
    if(number == 0){
        toggle_display('rules-section', 'flex');
        element.classList.remove('slideOutDown');
        element.classList.add('animated','slideInUp');
    }
    if(number == 1){
        element.classList.remove('slideInUp');
        element.classList.add('animated','slideOutDown');
        setTimeout(()=>{toggle_display('rules-section', 'flex');},1000);
    } 
}


function toggle_display(id, display_value){
    let element = document.getElementById(id);
    if(element.style.display === "none") element.style.display = display_value;
    else element.style.display = "none";
}


