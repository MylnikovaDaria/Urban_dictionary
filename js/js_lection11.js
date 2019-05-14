const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

document.getElementById('submit').onclick = () => {
  let term = document.getElementById("search").value;
  main.innerHTML = "";

  axios.get(`http://api.urbandictionary.com/v0/define?term=${term}`)
    .then(response => {
      document.getElementById("section_example").style.display = "none";

      response.data.list.forEach(x => {
        let mainBlock = createDiv(main, "main_block");

        // add definitions` number
        let mainDef = createSpan(mainBlock, "main_span");
        mainDef.innerHTML = response.data.list.indexOf(x) + 1;

        // add word
        let mainWord = createH2(mainBlock, "main_h2");
        mainWord.innerHTML = term;


        // add definitions

        let classNameMainOl = "ol_none";
        let definitions = customReplace(x.definition);
        let mainDefinition = customSplit(definitions);

        console.log(x.example);
        if (mainDefinition.length > 1) {
          classNameMainOl = "main_ol";
        }

        if (mainDefinition.length < 1) {
          document.getElementsByClassName(mainBlock, 'main_ol').style.listStyleType = "none";
        }

        let mainOl = createUl(mainBlock, classNameMainOl);

        mainDefinition.forEach(x => createLi(mainOl, "main_li", x));

        // add examples
        let examples = customReplace(x.example);
        let mainExample = customSplit(examples);

        if (mainExample.length > 1) {
          classNameMainOl = "main_ol";
        }

        if (mainExample.length < 1) {
          document.getElementsByClassName(mainBlock, 'main_ol').style.listStyleType = "none";
        }

        let mainOlExample = createUl(mainBlock, classNameMainOl);

        mainExample.forEach(x => createLi(mainOlExample, "main_li_example", x));

        // add author and date
        let mainAuthor = createP(mainBlock, "main_p");
        let mainTime = new Date(x.written_on);
        let author = createA(mainAuthor, "main_a", x.author);


        mainAuthor.insertAdjacentHTML("afterbegin", "by ");
        mainAuthor.insertAdjacentHTML("beforeend", ` ${monthNames[mainTime.getMonth()]} ${mainTime.getDate()}, ${mainTime.getFullYear()}`);

        // add likes
        let mainThumbsUp = createA(mainBlock, "main_a_like", `${x.thumbs_up} <i class="fas fa-thumbs-up"></i>`);

        let mainThumbsDown = createA(mainBlock, "main_a_like", `${x.thumbs_down} <i class="fas fa-thumbs-down"></i>`);

      });
      let add = createDiv(main, "main_add");
      document.getElementsByClassName("main_span")[1].innerHTML = "Top difinition";
    })
}


let main = document.getElementById('main');

function createDiv(parentTag, className) {
  let div = document.createElement('div');
  div.className = className;
  parentTag.appendChild(div);
  return div
}


function createSpan(parentTag, className) {
  let span = document.createElement("span");
  span.className = className;
  parentTag.appendChild(span);
  return span
}

function createP(parentTag, className) {
  let p = document.createElement("p");
  p.className = className;
  parentTag.appendChild(p);
  return p
}

function createH2(parentTag, className) {
  let h2 = document.createElement("h2");
  h2.className = className;
  parentTag.appendChild(h2);
  return h2
}

function createA(parentTag, className, data) {
  let a = document.createElement("a");
  a.className = className;
  a.innerHTML = data;
  parentTag.appendChild(a);
  return a
}

function createUl(parentTag, className) {
  let ol = document.createElement("ol");
  ol.className = className;
  parentTag.appendChild(ol);
  return ol;
}


function createLi(parentTag, className, data) {
  let li = document.createElement("li");
  li.className = className;
  parentTag.appendChild(li);
  li.innerHTML = data;
  return li;
}


function customSplit(data) {
  let arrLi = data.split(/\d\.|\d\)/)

  if (arrLi.length > 1) {
    arrLi = arrLi.slice(1);
  }
  return arrLi;
}

function customReplace(string) {
  let updateString = string.replace(/\[/g, `<a class="link" href="#">`).replace(/\]/g, `</a>`).replace(/\n/g, `<br>`);;
  return updateString;
}