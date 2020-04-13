//immediatly invoked function expression
(function () {
    //using strict mode
    'use strict';




    let form = document.getElementById('form');
    let mainCard = document.getElementById('main');
    let resetbtn = document.getElementById('reset');
    let divReset = document.getElementById('div');
    let savebtn = document.getElementById('save');
    document.addEventListener('DOMContentLoaded', () => {




        //validation of the loop number input
        let button = document.getElementById('button');
        let loopinput = document.getElementById('loopNumber');
        button.disabled = true;
        loopinput.addEventListener('keyup', () => {
            if (loopinput.value === '') {
                // alert('Please fill the first textbox');
                button.focus();
                button.disabled = true;
            } else {
                button.disabled = false;
            }

        });
        button.addEventListener('click', buttonClick);
        //function that triggers all functionalities
        function buttonClick(e) {
            e.preventDefault();
            let loopNumber = parseInt(document.getElementById('loopNumber').value, 10);
            let title = document.querySelector('.title');
            var arrayoption = ['A', 'B', 'C', 'D', 'F'];
            for (let i = 1; i <= loopNumber; i++) {
                let div = document.createElement('div');
                div.className = "form-group";
                form.appendChild(div);
                let courseInput = document.createElement('input');
                let gradeInput = document.createElement('select');
                let unitInput = document.createElement('input');
                courseInput.className = 'btn btn-outline-primary mt-sm-2';
                unitInput.className = 'btn btn-outline-primary mt-sm-2';
                gradeInput.className = `btn btn-outline-primary  `;
                courseInput.style.color = 'black';
                unitInput.style.color = 'black';
                gradeInput.style.color = 'black';
                courseInput.id = `course${i}`;
                gradeInput.id = `grade${i}`;
                unitInput.id = `unit${i}`;
                courseInput.name = `course${i}`;
                gradeInput.name = `grade${i}`;
                unitInput.name = `unit${i}`;

                //for generating the select options dynamically
                for (let o = 0; o < arrayoption.length; o++) {
                    let option = document.createElement('option');
                    option.value = arrayoption[o];
                    option.text = arrayoption[o];
                    gradeInput.appendChild(option);
                }
                //ends 

                courseInput.setAttribute('required', 'yes');
                courseInput.setAttribute('placeholder', 'Enter CourseCode');
                courseInput.setAttribute('type', 'text');
                unitInput.setAttribute('required', true);
                unitInput.setAttribute('placeholder', 'Enter CourseUnit');
                unitInput.setAttribute('type', 'number');
                div.appendChild(courseInput);
                div.appendChild(gradeInput);
                div.appendChild(unitInput);
            }
            button.style.display = "none";
            loopinput.style.display = "none";
            title.innerHTML = "Enter Your Course Details";

            //creating the calculate button
            let calculate = document.createElement('button');
            calculate.className = "form-control mb-2 btn btn-primary";
            calculate.id = "calculate";
            calculate.style.color = 'white';
            calculate.appendChild(document.createTextNode('CALCULATE'));
            form.appendChild(calculate);

            let calculatebtn = document.getElementById('calculate');
            //console.log(calculatebtn);

            calculatebtn.addEventListener('click', gpCal);




            // performs the gp calculations
            function gpCal(e) {
                e.preventDefault();
                calculatebtn.style.display = 'none';
                title.innerHTML = "Your Calculation Details";
                let grade_array = [];
                let unit_array = [];
                let course_array = [];
                let grade = [];

                let gp = 0;
                let tg = 0;
                let total_courseunit = 0;
                let mgp = 0;

                for (let i = 1; i <= loopNumber; i++) {

                    course_array[i] = document.getElementById(`course${i}`).value;
                    grade_array[i] = document.getElementById(`grade${i}`).value;
                    unit_array[i] = parseInt(document.getElementById(`unit${i}`).value, 10);
                    document.getElementById(`grade${i}`).style.display = 'none';
                    document.getElementById(`unit${i}`).style.display = 'none';
                    document.getElementById(`course${i}`).style.display = 'none';


                    // Creating table to disply inputed values
                    let table = document.createElement('table');
                    table.className = 'table';

                    let tr = document.createElement('tr');
                    tr.className = "thead-dark";
                    let trd = document.createElement('tr');
                    let th1 = document.createElement('th');
                    let th2 = document.createElement('th');
                    let th3 = document.createElement('th');
                    let td1 = document.createElement('td');
                    let td2 = document.createElement('td');
                    let td3 = document.createElement('td');

                    form.appendChild(table);
                    table.appendChild(tr);
                    table.appendChild(trd);
                    tr.appendChild(th1);
                    th1.innerHTML = `CourseCode`;
                    tr.appendChild(th2);
                    th2.innerHTML = `Unit`;
                    tr.appendChild(th3);
                    th3.innerHTML = `Grade`;
                    trd.appendChild(td1);
                    td1.innerHTML = course_array[i];
                    trd.appendChild(td2);
                    td2.innerHTML = unit_array[i];
                    trd.appendChild(td3);
                    td3.innerHTML = grade_array[i];


                    total_courseunit = total_courseunit + unit_array[i];

                    switch (grade_array[i]) {
                        case 'A':
                            grade[i] = 5;
                            tg = grade[i] * unit_array[i];
                            gp = gp + tg;
                            break;
                        case 'B':
                            grade[i] = 4;
                            tg = grade[i] * unit_array[i];
                            gp = gp + tg;
                            break;
                        case 'C':
                            grade[i] = 3;
                            tg = grade[i] * unit_array[i];
                            gp = gp + tg;
                            break;
                        case 'D':
                            grade[i] = 2;
                            tg = grade[i] * unit_array[i];
                            gp = gp + tg;
                            break;
                        case 'F':
                            grade[i] = 0;
                            tg = grade[i] * unit_array[i];
                            gp = gp + tg;
                            break;
                        default:
                            grade[i] = 0;
                            tg = grade[i] * unit_array[i];
                            gp = gp + tg;

                    }

                }

                mgp = Math.round(gp / total_courseunit * 100) / 100;
                let display = document.getElementById("header-title");
                if (mgp) {
                    let style = { margin: '5px', border: '2px solid black', padding: '24px', borderRadius: '12px', color: 'white', backgroundColor: 'rgb(6, 192, 167)' }
                    Object.entries(style).map(entry => {
                        let [property, value] = entry;
                        console.log([property, value])
                        display.style[property] = value;
                    });
                    display.innerHTML = `GRADE POINT: ${mgp}`;
                } else if (mgp == 0) {
                    let style = { margin: '5px', border: '2px solid black', padding: '24px', borderRadius: '12px', color: 'white', backgroundColor: 'rgb(6, 192, 167)' }
                    Object.entries(style).map(entry => {
                        let [property, value] = entry;
                        console.log([property, value])
                        display.style[property] = value;
                    });
                    display.innerHTML = ` GRADE POINT: ${mgp}`;
                }
                else {
                    let style = {
                        margin: '5px', border: '2px solid black', padding: '24px', borderRadius: '12px', color: 'white',
                        backgroundColor: 'red'
                    }
                    Object.entries(style).map(entry => {
                        let [property, value] = entry;
                        console.log([property, value])
                        display.style[property] = value;
                    });
                    display.innerHTML = `INVALID CALCULATION`;
                }

                //getting gp result value to backend
                let gpInput = document.createElement('input');
                gpInput.name = 'gp';
                gpInput.value = mgp;
                gpInput.style.display = "none";
                form.appendChild(gpInput);


                //for displaying the GP result
                let resultDisplay = document.getElementById('resultDisplay');;
                resultDisplay.innerHTML = `Your GP Calculation IS ${mgp}`;

                if (mgp >= 4.5) {
                    let style = {
                        textAlign: 'center', margin: '5px', border: '2px solid black',
                        padding: '24px', borderRadius: '12px', color: '#ffffff', backgroundColor: 'rgb(6, 192, 167)'
                    };
                    Object.entries(style).map(entry => {
                        let [property, value] = entry;
                        console.log([property, value])
                        resultDisplay.style[property] = value;
                    });
                    savebtn.style.display = 'initial';
                } else if (mgp >= 3.5 && mgp < 4.5) {
                    let style = {
                        textAlign: 'center', margin: '5px', border: '2px solid black',
                        padding: '24px', borderRadius: '12px', color: '#ffffff', backgroundColor: '#001200'
                    };
                    Object.entries(style).map(entry => {
                        let [property, value] = entry;
                        console.log([property, value])
                        resultDisplay.style[property] = value;
                    });
                    savebtn.style.display = 'initial';
                }
                else if (mgp >= 3 && mgp < 3.5) {

                    let style = {
                        textAlign: 'center', margin: '5px', border: '2px solid black',
                        padding: '24px', borderRadius: '12px', color: '#ffffff', backgroundColor: '#f19000'
                    };
                    Object.entries(style).map(entry => {
                        let [property, value] = entry;
                        console.log([property, value])
                        resultDisplay.style[property] = value;
                    });

                    savebtn.style.display = 'initial';
                } else if (mgp >= 2 && mgp < 3) {
                    let style = {
                        textAlign: 'center', margin: '5px', border: '2px solid black',
                        padding: '24px', borderRadius: '12px', color: '#ffffff', backgroundColor: '#e15000'
                    };
                    Object.entries(style).map(entry => {
                        let [property, value] = entry;
                        console.log([property, value])
                        resultDisplay.style[property] = value;
                    });

                    savebtn.style.display = 'initial';
                } else if (mgp >= 0 && mgp < 2) {

                    let style = {
                        textAlign: 'center', margin: '5px', border: '2px solid black',
                        padding: '24px', borderRadius: '12px', color: '#ffffff', backgroundColor: '#ff0000'
                    };
                    Object.entries(style).map(entry => {
                        let [property, value] = entry;
                        console.log([property, value])
                        resultDisplay.style[property] = value;
                    });

                    savebtn.style.display = 'initial';
                } else {
                    let style = {
                        textAlign: 'center', margin: '5px', border: '2px solid black',
                        padding: '24px', borderRadius: '12px', color: '#ffffff', backgroundColor: '#ff0000'
                    };
                    Object.entries(style).map(entry => {
                        let [property, value] = entry;
                        console.log([property, value])
                        resultDisplay.style[property] = value;
                    });
                    resultDisplay.innerHTML = `Please enter course unit`;
                    savebtn.style.display = 'none';
                }

                mainCard.appendChild(resultDisplay);
                resultDisplay.style.display = 'initial';

                divReset.className = "form-group";
                mainCard.appendChild(divReset);
                divReset.appendChild(resetbtn);
                resetbtn.style.display = 'initial';
                resetbtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    location.reload();
                });


                form.appendChild(divReset);
                divReset.appendChild(savebtn);



            }


        }
    });
})();