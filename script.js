'use strict';

const money = [500, 200, 100, 50, 20, 10, 5, 2, 1];
const coins = [.50, .25, .10, .05, .02, .01];
function calculate() {
    let sum = parseFloat(document.getElementById('summ').value) - parseFloat(document.getElementById('price').value);
    const result = document.getElementById('result');
    let coinSet = {
        money: [],
        coins: []
    };
    result.className = '';
    if (sum <= 0) {
        result.className = 'error';
        result.innerHTML = 'Сума повинна бути більшою ніж ціна';
    } else {
        for(let i = 0;i < money.length;) {

            if (money[i] > sum) {
                i++;
            } else {
                coinSet.money.push(money[i]);
                sum -= money[i];
            }
        }
        for(let i = 0;i < coins.length;) {

            if (coins[i] > sum) {
                i++;
            } else {
                coinSet.coins.push(coins[i]);
                sum -= coins[i];
            }
        }
        generateResult(result, coinSet);

    }


}

function generateResult (element, coinSet) {
    const money = coinSet.money.reduce((a, b) => a + b, 0);
    const coins = coinSet.coins.reduce((a, b) => a + b, 0);

    let nominal = '';
    let lastIndex = 0;
    for (let coin of coinSet.money) {
        if ( coin === lastIndex) {
            nominal = nominal.substring(0, nominal.length - 2);
            nominal += '*2, ';
        } else {
            lastIndex = coin;
            let text = ' доларів';

            if (coin === 1) {
                text = ' долар'
            }
            if (coin === 2) {
                text = ' долари'
            }
            nominal = nominal += coin + text + ', ';
        }
    }
    for (let coin of coinSet.coins) {
        if ( coin === lastIndex) {
            nominal.substring(0, nominal.length - 2);
            nominal += '*2, ';
        } else {
            let text = ' центів';
            if (coin === 0.01) {
                text = ' цент'
            }
            if (coin === 0.02) {
                text = ' центи'
            }
            lastIndex = coin;
            nominal += coin*100 + text +', ';
        }
    }
    nominal = nominal.substring(0, nominal.length - 2);
    let moneyText = 'доларів';
    if (money.toString().split('').pop() === '1') {
        moneyText = 'долар'
    }
    if (money.toString().split('').pop() === '2') {
        moneyText = 'долари'
    }
    let text = 'центів';
    if (coins.toString().split('').pop() === '1') {
        text = 'цент'
    }
    if (coins.toString().split('').pop() === '2') {
        text = 'центи'
    }

    element.innerHTML = 'Ваша решта: '+money+' '+moneyText+','+coins+' '+text+'. (по номіналу '+nominal+'.)';
}


function popup (title, text,group = false, buttons = []) {
    const item = new Popup();

    item.group = group;
    item.create({title, text, buttons});
}


var Popup = function () {
        this.group = false;
        this.defaults = {
          title: '',
          text: '',
          width: 600,
          height: 400,
          classes: '',
          buttons: []  // {text, callback}
        };

};

Popup.prototype.create = function (options = {}) {
    console.log('Popup created');
    let defaults = this.defaults;
    Object.keys(options).forEach( el => {
        defaults[el] = options[el];
    });
    if (this.group) {
        this.container = document.getElementById(this.group);
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = this.group;
            this.container.className = 'modal-container';
            document.body.appendChild(this.container);

        }
    } else {

        this.container = document.createElement('div');
        this.container.className = 'modal-container';
        document.body.appendChild(this.container);

    }

    this.closeButton = document.createElement('div');
    this.closeButton.innerHTML = 'X';
    this.closeButton.className = 'close';
    this.closeButton.onclick = this.close;

    this.element = document.createElement('div');
    this.element.style.width = defaults.width + 'px';
    this.element.style.height = defaults.height + 'px';
    this.element.style.marginLeft = -1 * (defaults.width / 2) + 'px';
    this.element.style.marginTop = -1 * (defaults.height / 2 + 100) + 'px';
    this.element.style.top = '50%';
    this.element.style.left = '50%';
    this.element.className = 'modal '+ defaults.classes;
    this.element.innerHTML = '<h3>'+defaults.title+'</h3>';
    this.element.innerHTML += '<div>'+defaults.text+'</div>';

    this.container.appendChild(this.element);
    this.element.appendChild(this.closeButton);
    for (let button of defaults.buttons) {
        let buttonElement = document.createElement('div');
        buttonElement.className = 'button';
        buttonElement.onclick = button.callback;
        buttonElement.innerHTML = button.text;
        this.element.appendChild(buttonElement);
    }
};

Popup.prototype.close = function () {
    console.log('Popup closed');
    if (this.container) {
        if (this.group) {
            this.element.remove();
        } else {
            this.container.remove();
        }
    } else {
        if (this.parentElement.parentElement.childNodes.length === 1) {
            this.parentElement.parentElement.classList.remove('modal-container');
            void this.parentElement.parentElement.offsetWidth;
            this.parentElement.parentElement.classList.add('close');
            this.parentElement.parentElement.classList.add('modal-container');
            setTimeout( () => {
                this.parentElement.parentElement.remove();
            }, 450)
        } else {
            this.parentElement.remove();
        }

    }
};



function callback() {
    popup('Window2', 'Click on the X', 'group1')
}