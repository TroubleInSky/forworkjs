var FormTable = function (formElement, tableElement, structure, errorHandler) {
    this.structure = structure;
    this.data = [
        [0, 'test@email.com', 'name', 'surname'],
        [1, 'test@email.com', 'name', 'surname'],
        [2, 'test@email.com', 'name', 'surname'],
        [3, 'test@email.com', 'name', 'surname'],
        [4, 'test@email.com', 'name', 'surname']
    ];
    this.form = formElement;
    this.form.onsubmit = this.submit.bind(this);
    this.table = tableElement;
    this.table.style.display = 'none';
    this.generateTableHeader();
    this.generateRows();
    this.errorHandler = errorHandler;
};

FormTable.prototype.generateTableHeader = function () {
    const tr = document.createElement('tr');

    let checkTd = document.createElement('td');
    checkTd.innerHTML = '#';
    tr.appendChild(checkTd);

    for (let tdData of this.structure) {
        let td = document.createElement('td');
        td.innerHTML = tdData;
        tr.appendChild(td);
    }
    this.table.appendChild(tr);
};
FormTable.prototype.generateRows = function () {
    if (this.data.length >= 0) {
        this.table.style.display = 'block';
    }
    this.table.innerHTML = '';
    this.generateTableHeader();
    for (let row of this.data) {
        const tr = document.createElement('tr');

        let checkTd = document.createElement('td');
        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.value = row[0];
        checkTd.appendChild(checkbox);
        tr.onclick = () => {
            this.updateRowForm(checkbox.value);
        };
        tr.appendChild(checkTd);
        let i = 0;
        for (let data of row) {
            i++;
            if (i === 1) continue;
            let td = document.createElement('td');
            td.innerHTML = data;

            tr.appendChild(td);
        }

        this.table.appendChild(tr);
    }
};

FormTable.prototype.generateRow = function (id = false) {
    const tr = document.createElement('tr');
    if (this.data.length >= 0) {
        this.table.style.display = 'block';
    }

    let checkTd = document.createElement('td');
    let checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.value = id ? id : this.data.length;
    checkTd.appendChild(checkbox);
    tr.onclick = () => {
        this.updateRowForm(checkbox.value);
    };
    tr.appendChild(checkTd);

    this.data.push([checkbox.value, ...this.form]);
    for (let data of this.form) {
        let td = document.createElement('td');
        td.innerHTML = data.value;
        data.value = '';
        tr.appendChild(td);
    }

    this.table.appendChild(tr);
};

FormTable.prototype.updateRowForm = function (updatedRow) {
    let text = '<div class="form">';
    let i = 0;
    for (let input of this.form) {
       if (input.type !== 'submit') {
           text +=  '<label>'+this.structure[i]+'</label><input  type="'+input.type+'" value="'+this.data[updatedRow][i+1]+'"><br>';
           i++;
       }
    }
    text += '</div>';
    this.formPopup = new Popup();
    this.updatedRow = updatedRow;
    this.formPopup.create({
        title: 'Update',
        group: 'FormTable',
        text: text,
        buttons: [{text:'Update', callback: this.updateRow.bind(this)}]
    });
};

FormTable.prototype.updateRow = function () {
    let validate = false;
    const inputs = this.formPopup.element.children[1].children[0].getElementsByTagName('input');


    for (let i = 0; i < this.form.length - 1; i++) {

            validate = this.validate(inputs[i]);
            if (validate) {
                this.data[this.updatedRow][i+1] = validate;
                this.generateRows();
                this.formPopup.close();
            } else {
                return false;
            }

    }
};
FormTable.prototype.validate = function (input) {
    const loginRegex = /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/igm;

    switch (input.type) {
        case 'email':
            if (input.value.match(loginRegex) === null) {
                this.errorHandler('Email not valid');
                return false;
            } else {
                return input.value;
            }
            break;
        case 'text':
            if (input.value.length < 1) {
                this.errorHandler('Field can not be empty');
                return false;
            } else {
                return input.value;
            }
            break;
        default:
            return false;
    }
};

FormTable.prototype.submit = function (e) {
    e.preventDefault();

    let validate;
    for (let input of this.form) {
        if (input.type !== 'submit') {
            validate = this.validate(input);
           if (!validate) {
               return false;
           }
        }
    }

    if (validate) {
        this.generateRow();
    }

};



function errorHandler(text) {
    new Popup().create({
        title: 'Error',
        text: text,
        width: 300,
        group: 'FormTable',
        height: 100
    });
}
window.onload = function () {
    new FormTable(document.getElementById('form'), document.getElementById('table'), ['E-Mail','Name','Surname'], errorHandler);
};