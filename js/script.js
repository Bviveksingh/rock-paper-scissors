




hide_elements();
let initialise = initialise_commands();
let score = score_count();
let score_view_element = document.getElementById('score');



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

// let score1 = (function(){
//     let score = 0;
    
//     let change = (result_score) => {
//         if(score === 0 && result_score < 0) return;
//         else score+=result_score;
//     }

//     return {
//         change:change,
//         value: () => score
//     }
// })();

// console.log(score1);

function start_duel(user_command){
    toggle_display('action-section-duel','flex');
    
    display_user_command(user_command);
    toggle_display('action-section-result','flex');

    let computer_command = display_computer_command();
    let result = compute_result(user_command,computer_command);
    
    display_result(result);
    change_score(result);
}

function display_user_command(user_command){
    let user_command_reference = initialise.get_reference(user_command);
    
    let element = document.getElementById('user-result');
    element.classList.remove(element.classList.item[1]);
    element.classList.add(`result-${user_command_reference}`);
    


    let svg_element = element.querySelector('.result-svg');
    svg_element.classList.remove(element.classList.item[1]);
    svg_element.classList.add(`${user_command_reference}`);
    // svg_element.classList.toggle(`${user_command_reference}`);

}

function display_computer_command(){
    let all_computer_commands = initialise.commands();
    let random_number = Math.floor(Math.random() * all_computer_commands.length); 
    let computer_command = all_computer_commands.filter(element => element.value === random_number).shift();

    let element = document.getElementById('computer-result');
    element.classList.add(`result-${computer_command["name"]}`);
    // element.classList.toggle(`result-${computer_command["name"]}`);
    
    let svg_element = element.getElementsByClassName('result-svg')[0];
    // svg_element.classList.toggle(`${computer_command["name"]}`);
    
    svg_element.classList.add(`${computer_command["name"]}`);

    return computer_command;
}

function compute_result(user_command,computer_command){
    
    if(user_command === computer_command.value) return 0;
    else{
        if(computer_command[user_command] == 1) return 1;
        if(computer_command[user_command] == 0) return -1;
    }

}

function display_result(result){
    let element = document.getElementById('result-text');
    element.innerHTML = initialise.get_result_reference(result);
    toggle_display('main-result','block');
}


function change_score(result){
    score.change(result);
    score_view_element.innerHTML = score.value();
    console.log(score.value());
}

function play_again(){
    toggle_display('action-section-result','flex');
    toggle_display('action-section-duel','flex');
    toggle_display('main-result','flex');
}


function hide_elements(){
    toggle_display('rules-section','flex');
    toggle_display('action-section-result','flex');
    toggle_display('main-result','flex');

}

function toggle_display(id, display_value){
    let element = document.getElementById(id);
    if(element.style.display === "none") element.style.display = display_value;
    else element.style.display = "none";
}


