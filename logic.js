//#region Logic of Cals
//Обратная польская нотация
let currentExp = "";
let stack = [];

function GetPriority(char)
{
    if (char == "*" || char =="/") return 2;
    else if (char == "+" || char == "-") return 1;
    else return 0;
}

function ExpToRPN(exp)
{
    for(let i = 0; i < exp.length; i++)
    {
        priority = GetPriority(exp[i]); //текущий приоритет знака

        if(exp[i] == "_")
        {
            currentExp += "_1";
            i += 1;
            continue;
        }
        if(priority == 0)
        {
            currentExp += exp[i];
        }
        else
        {
            currentExp += " ";
            while(stack.length != 0)
            {
                if(priority <= GetPriority(stack[stack.length - 1]))
                {
                    if(currentExp[currentExp.length != " "]) currentExp += " ";
                    currentExp += stack.pop();
                } 
                else break;
            }
            stack.push(exp[i]);
        }
    }

    while(stack.length != 0)
    {
        currentExp += " ";
        currentExp += stack.pop();
    }

    currentExp.trim();
}

function RPNToExp(rpn)
{
    let sym = "";
    let stack_ans =[];

    for(let i = 0; i < rpn.length; i++)
    {
        if(rpn[i] == " ") continue;

        if(GetPriority(rpn[i]) == 0)
        {
            while(rpn[i] != " " && GetPriority(rpn[i]) == 0)
            {
                if(rpn[i] == "_")
                {
                    sym = "-" + sym;
                    i += 2;
                }
                else
                {
                    sym += rpn[i];
                    i++;
                }


                if(i == rpn.length) break;
            }

            stack_ans.push(Number(sym));
            sym = "";
        }

        if(GetPriority(rpn[i]) > 0)
        {
            let a = Number(stack_ans.pop());
            let b = Number(stack_ans.pop());
            switch(rpn[i])
            {
                case "+":
                    stack_ans.push(b+a);
                    break;

                case "-":
                    stack_ans.push(b-a);
                    break;

                case "*":
                    stack_ans.push(b*a);
                    break;

                case "/":
                    stack_ans.push(b/a);
                    break;
            }
        }
    }
    currentExp = "";
    return stack_ans.pop();
}
//#endregion Logic of Cals

let isDouble = false; //проверка на "."
let BeenAns = false;  //проерка на то, была ли нажата клавиша "="
let oneOperation = false; //проверка на наличие хотя бы одной операции в выражение
let expression = ""; //выражение, которое будет поссылаться в функцию обработки

function Begin()
{
    expression = "0";
    document.form1.textView.value = expression;
}

function InputNum(num)
{
    if(expression == "0" || BeenAns)
    {
        expression = "";
        document.form1.textView.value = "";
        BeenAns = false;
    }
    if(document.form1.textView.value[document.form1.textView.value.length - 1] != ")")
    {    
        expression += num;
        document.form1.textView.value += num;
    }    
}

function ClearAll()
{
    expression = "0";
    document.form1.textView.value = expression;
    oneOperation = false;
    isDouble = false;
}

function ClearOne()
{
    let tmp = document.form1.textView.value;

    if(tmp[tmp.length - 1] == ".")
    {
        isDouble = false;
    }

    expression = expression.substring(0, expression.length-1);
    document.form1.textView.value = tmp.substring(0, tmp.length - 1)

    if(expression == "")
    {
        expression = "0";
        document.form1.textView.value = expression;
    }

	if(tmp == "Error" || tmp == "Infinity" || tmp == "NaN")
	{
		expression = "0";
        document.form1.textView.value = expression;
	}
}

function ToDouble()
{
    let tmp = document.form1.textView.value;

    if("0" <= tmp[tmp.length - 1] && tmp[tmp.length - 1] <= "9" && !isDouble && !BeenAns)
    {
        expression += ".";
        document.form1.textView.value += ".";
        isDouble = true;
        BeenAns = false;
    }
}

function InputOperation(op)
{
    let tmp = document.form1.textView.value;
    oneOperation = true;
    isDouble = false;

    if("0" <= tmp[tmp.length-1] && tmp[tmp.length-1] <= "9" && !BeenAns || tmp[tmp.length-1] == ")")
    {
        expression += op;
        document.form1.textView.value += op;
    }

    else if((tmp[tmp.length - 1] == "+" || tmp[tmp.length - 1] == "-" ||
            tmp[tmp.length - 1] == "*" || tmp[tmp.length - 1] == "/") && !BeenAns)
    {
        tmp = tmp.substring(0, tmp.length-1) + op;
        expression = tmp;
        document.form1.textView.value = tmp
    }
}

function Equel()
{
    let exp = document.form1.textView.value;
    if(exp.includes("+") || exp.includes("-") || exp.includes("*") || exp.includes("/"))
    {
        if(exp[exp.length - 1] == "+" || exp[exp.length - 1] == "-" ||
           exp[exp.length - 1] == "*" || exp[exp.length - 1] == "/" ||
           exp[exp.length - 1] == "." || exp == "Error")
        {
            document.form1.textView.value = "Error";
        }
        else
        {
            ExpToRPN(expression);
            document.form1.textView.value = RPNToExp(currentExp);
        }
        isDouble = false;
        BeenAns = true;
    }   
}

function MakeNegetiv()
{
    let exp = document.form1.textView.value;
    let pos = getPossition(exp);
    
    if("0" <= exp[exp.length - 1] && exp[exp.length - 1] <= "9")    
    {  
        if(exp[pos] == "+" || exp[pos] == "-" ||
           exp[pos] == "*" || exp[pos] == "/" || !oneOperation)
        {
            if(oneOperation) document.form1.textView.value = add_word_in_string(exp, "(-", pos + 1) + ")";
            else document.form1.textView.value = add_word_in_string(exp, "(-", pos) + ")";
            
            expression += "_1";
        }
    }    
}

//#region вспомогательные функции(Велосипеды)
function add_word_in_string(s1, word, possition)
{
    let ans = "";
    for(let i = 0; i < possition; i++)
    {
        ans += s1[i];
    }
    
    ans += word;
    
    for(let i = possition; i < s1.length; i++)
    {
        ans += s1[i];
    }
    
    return ans;
}

function getPossition(s1)
{
	let ans;
	for(let i = s1.length - 1; i >= 0; i--)
	{
		if(s1[i] == "+" || s1[i] == "-" || s1[i] == "*" || s1[i] == "/") return i;
    }
    return 0;
}
//#endregion вспомогательные функции(Велосипеды)


//#region Анимация при нажатии
let last_color;
function Press(e)
{
    e = e || window.event;
    var el = e.target || e.srcElement;
    let a = document.getElementById(el.id);

    last_color = a.style.background;
    a.style.background = "#f3ce8d";
}
function NotPress(e)
{
    e = e || window.event;
    var el = e.target || e.srcElement;
    let a = document.getElementById(el.id);

    a.style.background = last_color;
}

let listOfElem = document.getElementsByClassName("item");
for(let i = 0; i <listOfElem.length;i++)
{
    listOfElem[i].id = i + 1;
    listOfElem[i].addEventListener('mousedown', Press);
    listOfElem[i].addEventListener('mouseup', NotPress);
}
//#endregion Анимация при нажатии