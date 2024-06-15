let people;
const root = document.querySelector('#root');
let table;

const tabletitles = [
    "firstName",
    "lastName",
    "age",
    "mail",
    "address",
    "phone",
    "birthDate"
];

async function Takeusers(number) {
    const url = `https://randomuser.me/api/?results=${number}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results) {
            return data.results;
        }
    } catch (err) {
        console.error('Error fetching users:', err);
        return [];
    }
}

function CreateElement(element, id = '') {
    const e = document.createElement(element);
    if (id) e.id = id;
    return e;
}

function CreateTableTitle() {
    const tr = CreateElement('tr');

    tabletitles.forEach(title => {
        const th = CreateElement('th');
        th.innerText = title;
        tr.appendChild(th);
    });
    return tr;
}

function CreateSkeleton() {
    const existingTable = document.querySelector('#table');
    if (existingTable) {
        existingTable.remove();
    }

    const table = CreateElement('table', 'table');
    root.appendChild(table);
    const titles = CreateTableTitle();
    table.appendChild(titles);
    return table;
}

function CreateMain() {
    table = CreateSkeleton();

    people.forEach(person => {
        const tr = CreateElement('tr');
        const tdname = CreateElement('td');
        tdname.innerText = person.name.first;
        const tdlast = CreateElement('td');
        tdlast.innerText = person.name.last;
        const tdage = CreateElement('td');
        tdage.innerText = new Date().getFullYear() - new Date(person.dob.date).getFullYear();
        const tdmail = CreateElement('td');
        tdmail.innerText = person.email;
        const tdadd = CreateElement('td');
        tdadd.innerText = `${person.location.city}, ${person.location.state}, ${person.location.country}`;
        const tdphone = CreateElement('td');
        tdphone.innerText = person.phone;
        const tddob = CreateElement('td');
        tddob.innerText = new Date(person.dob.date).toLocaleDateString();
        tr.append(tdname, tdlast, tdage, tdmail, tdadd, tdphone, tddob);
        table.appendChild(tr);
    });
}


function CreateForm() {
    const formContainer = CreateElement('div', 'form-container');
    const label = CreateElement('label');
    label.setAttribute('for', 'num-people');
    label.innerText = 'Number of people:';

    const input = CreateElement('input', 'num-people');
    input.type = 'number';
    input.min = '1';
    input.max = '200';
    input.value = '5';

    const button = CreateElement('button', 'fetch-button');
    button.innerText = 'Fetch Users';

    formContainer.appendChild(label);
    formContainer.appendChild(input);
    formContainer.appendChild(button);
    root.appendChild(formContainer);

    button.addEventListener('click', async () => {
        const numPeople = input.value;
        people = await Takeusers(numPeople);
        CreateMain();
    });

    input.addEventListener('keydown', async (e) => {
        if (e.key === "Enter") {
            const numPeople = input.value;
            people = await Takeusers(numPeople);
            CreateMain();
        }
    });
}


window.onload = async function () {
    CreateForm();
    const numPeople = document.getElementById('num-people').value;
    people = await Takeusers(numPeople);
    CreateMain();
};