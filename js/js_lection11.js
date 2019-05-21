const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Абстрактный класс с функциями создания html тегов
class StructureConstructor {
  constructor(classNames) {
    this.classNames = classNames;
  }

  createDiv() {
    let div = document.createElement('div');
    div.className = this.classNames.div;
    return div
  }

  createSpan(inner) {
    let span = document.createElement("span");
    span.className = this.classNames.span;
    span.innerHTML = inner;
    return span
  }

  createP(inner) {
    let p = document.createElement("p");
    p.className = this.classNames.p;
    p.innerHTML = inner;
    return p
  }

  createH2(inner) {
    let h2 = document.createElement("h2");
    h2.className = this.classNames.h2;
    h2.innerHTML = inner;
    return h2
  }

  createA(inner) {
    let a = document.createElement("a");
    a.className = this.classNames.a;
    a.innerHTML = inner;
    return a
  }

  createUl() {
    let ol = document.createElement("ol");
    ol.className = this.classNames.ul;;
    return ol;
  }

  createLi(parentTag, inner) {
    let li = document.createElement("li");
    li.className = this.classNames.li;
    li.innerHTML = inner;
    parentTag.appendChild(li);
    return li;
  }
}

// Конструктор блоков после get запроса
class CardsConstructor extends StructureConstructor {
  constructor(classNames, index, term, definition, example, author, upvotes, downvotes, time) {
    super(classNames);
    this.index = index;
    this.term = term;
    this.definition = definition;
    this.example = example;
    this.author = author;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
    this.time = time;
  }

  customSplit(data) {
    let arrLi = data.split(/\d\.|\d\)/)

    if (arrLi.length > 1) {
      arrLi = arrLi.slice(1);
    }
    return arrLi;
  }

  customReplace(string) {
    let updateString = string.replace(/\[/g, `<a class="link" href="#">`).replace(/\]/g, `</a>`).replace(/\n/g, `<br>`);;
    return updateString;
  }

  createUl(className) {
    let ol = document.createElement("ol");
    ol.className = className;
    return ol;
  }


  createDefinitions() {
    let classNameDefinitions = "ol_none";
    let definitions = this.customReplace(this.definition);
    let mainDefinition = this.customSplit(definitions);

    if (mainDefinition.length > 1) {
      classNameDefinitions = this.classNames.ul;
    }

    if (mainDefinition.length < 1) {
      document.getElementsByClassName(this.classNames.ul).style.listStyleType = "none";
    }

    let mainOl = this.createUl(classNameDefinitions);
    mainDefinition.forEach(x => this.createLi(mainOl, x));
    return mainOl;
  }

  createExamples() {
    let classNameExamples = "ol_none";
    let examples = this.customReplace(this.example);
    let mainExample = this.customSplit(examples);

    if (mainExample.length > 1) {
      classNameExamples = this.classNames.ul;
    }

    if (mainExample.length < 1) {
      document.getElementsByClassName(this.classNames.ul).style.listStyleType = "none";
    }

    let mainOlExample = this.createUl(classNameExamples);
    mainExample.forEach(x => this.createLi(mainOlExample, x));
    return mainOlExample;
  }

  createTime() {
    let mainTime = new Date(this.time);
    let string = ` ${monthNames[mainTime.getMonth()]} ${mainTime.getDate()}, ${mainTime.getFullYear()}`;
    return string;
  }

  createString() {
    let p = this.createP("");
    p.insertAdjacentHTML("afterbegin", "by ");
    p.appendChild(this.createA(this.author));
    p.insertAdjacentHTML("beforeend", this.createTime());
    return p
  }

  createThumbsUp() {
    let a = this.createA(`${this.upvotes} <i class="fas fa-thumbs-up"></i>`);
    return a
  }

  createThumbsDown() {
    let a = this.createA(`${this.downvotes} <i class="fas fa-thumbs-down"></i>`);
    return a
  }

  outputDiv() {
    let outputDiv = this.createDiv();
    outputDiv.appendChild(this.createSpan(this.index + 1));
    outputDiv.appendChild(this.createH2(this.term));
    outputDiv.appendChild(this.createDefinitions());
    outputDiv.appendChild(this.createExamples());
    outputDiv.appendChild(this.createString());
    outputDiv.appendChild(this.createThumbsUp());
    outputDiv.appendChild(this.createThumbsDown());
    return outputDiv;
  }
}

// Конструктор для построение блока с данными из localStorage
class HistoryConctructor extends StructureConstructor {
  constructor(classNames, words) {
    super(classNames);
    this.words = words;
  }


  createWords() {
    let mainOl = this.createUl();
    this.words.forEach(x => this.createLi(mainOl, (`<a class="link_custom">` + x + `</a>`)));
    return mainOl;
  }

  outputHistory() {
    let recentlyViewedWords = this.createDiv();
    recentlyViewedWords.appendChild(this.createSpan("Recently viewed words"));
    recentlyViewedWords.appendChild(this.createWords());
    return recentlyViewedWords;
  }
}

// Сохранение истории запросов в localStorage
let addWordToHistory = term => {
  let historyWords = JSON.parse(localStorage.getItem('history'));
  if (historyWords === null) {
    localStorage.setItem('history', JSON.stringify([term]));
  } else if (historyWords.includes(term) == true) {
    return
  } else {
    historyWords.push(term);
    localStorage.setItem('history', JSON.stringify(historyWords));
  }
}


// Входные данные
let main = document.getElementById('main');
let aside = document.getElementById('aside');
let term;
let classNames = {
  div: "main_block",
  span: "main_span",
  p: "main_p",
  ul: "main_ol",
  h2: "main_h2",
  li: "main_li",
  a: "main_a_like"
}

let classNamesHistory = {
  div: "section_example_ad_item",
  span: "main_span",
  p: "main_p",
  ul: "main_ol",
  h2: "main_h2",
  li: "main_li",
  a: "link_custom"
}

let classNamesAdd = {
  div: "main_add"
}


// Получение данных из localStorage и отображение на странице
let showWordfromHistory = () => {
  document.getElementById("cup").style.display = "none";
  let historyWords = JSON.parse(localStorage.getItem('history'));
  let words = historyWords.slice(0, 10);
  let recentlyViewedWords = new HistoryConctructor(classNamesHistory, words);
  aside.insertAdjacentElement('afterBegin', recentlyViewedWords.outputHistory());
}

// Get запрос
document.getElementById('submit').onclick = () => {
  term = document.getElementById("search").value;
  main.innerHTML = "";
  axios.get(`http://api.urbandictionary.com/v0/define?term=${term}`)
    .then(response => {
      document.getElementById("section_example").style.display = "none";
      response.data.list.forEach(item => {

        let block = new CardsConstructor(classNames, response.data.list.indexOf(item), term, item.definition, item.example, item.author, item.thumbs_up, item.thumbs_down, item.written_on);
        main.appendChild(block.outputDiv());
      })
    })
    .then(() => document.getElementsByClassName('main_span')[3].innerHTML = 'Top Difinition')
  let add = new StructureConstructor(classNamesAdd);
  main.appendChild(add.createDiv());
  addWordToHistory(term);
}

// Отображение данных из localStorage на странице
showWordfromHistory();