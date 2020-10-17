//#region Logic of Cals
//Реализиция обратной польской нотации
let currentExp = "";
let stack = [];
let isNeg = false;

function GetPriority(char)
{
    if (char == "*" || char =="/") return 2;
    else if (char == "+" || char == "-") return 1;
    else return 0;
}

function ExpToRPN(exp)
{
    let flag = false;
    currentExp = "";
    for(let i = 0; i < exp.length; i++)
    {
        priority = GetPriority(exp[i]);

        if(exp[0] == "-" && !flag)
        {
            isNeg = true;
            flag = true;
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
                    currentExp += stack.pop();
                } 
                else break;
            }
            stack.push(exp[i]);
        }
    }

    while(stack.length != 0)
    {
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
                sym += rpn[i];
                i++;
                if(i == rpn.length) break;
            }

            stack_ans.push(Number(sym));
            // if(stack_ans.length == 1 && isNeg) stack_ans[0] *= -1;
            sym = "";
        }

        if(stack_ans.length == 1 && isNeg) stack_ans[0] = -stack_ans[0];

        if(GetPriority(rpn[i]) > 0)
        {
            let a = Number(stack_ans.pop());
            let b = Number(stack_ans.pop());
            switch(rpn[i])
            {
                case "+":
                    stack_ans.push(a+b);
                    break;

                case "-":
                    stack_ans.push(b-a);
                    break;

                case "*":
                    stack_ans.push(a*b);
                    break;

                case "/":
                    stack_ans.push(b/a);
                    break;
            }
        }
    }
    return stack_ans.pop();
}
//#endregion Logic of Cals

let isDouble = false; //проверка на наличие точки в числе
let BeenAns = false; //проверка на то была ли нажата кнопка =

function Begin()
{
    document.form1.textView.value = "0";
}

function InputNum(num)
{
    if(document.form1.textView.value == "0" || BeenAns)
    {
        document.form1.textView.value = "";
        BeenAns = false;
    }
    document.form1.textView.value += num;
}

function ClearAll()
{
    document.form1.textView.value = "0";
    isDouble = false;
}

function ClearOne()
{
    let tmp = document.form1.textView.value;

    if(tmp[tmp.length - 1] == ".")
    {
        isDouble = false;
    }

    document.form1.textView.value = tmp.substring(0, tmp.length-1);

    if(document.form1.textView.value == "")
    {
        document.form1.textView.value = "0";
    }
	
	if(tmp == "Error" || tmp == "Infinity" || tmp == "NaN" || tmp == "undefined")
	{
		document.form1.textView.value = "0";
	}
}

function ToDouble()
{
    let tmp = document.form1.textView.value;

    if("0" <= tmp[tmp.length - 1] && tmp[tmp.length - 1] <= "9" && !isDouble && !BeenAns)
    {
        document.form1.textView.value += ".";
        isDouble = true;
        BeenAns = false;
    }
}

function InputOperation(op)
{
    let tmp = document.form1.textView.value;
    isDouble = false;

    if(tmp == "0" && op == "-")
    {
        document.form1.textView.value = "-";
        BeenAns = false;
    }

    else if("0" <= tmp[tmp.length-1] && tmp[tmp.length-1] <= "9" && !BeenAns)
    {
        document.form1.textView.value += op;
    }

    else if((tmp[tmp.length - 1] == "+" || tmp[tmp.length - 1] == "-" ||
            tmp[tmp.length - 1] == "*" || tmp[tmp.length - 1] == "/") && tmp.length != 1)
    {
        tmp = tmp.substring(0, tmp.length-1) + op;
        document.form1.textView.value = tmp
    }
}

function Equel()
{
    let exp = document.form1.textView.value;
    if((exp.includes("+") || exp.includes("-") || exp.includes("*") || exp.includes("/")) && exp.length > 2)
    {
        if(exp[exp.length - 1] == "+" || exp[exp.length - 1] == "-" ||
           exp[exp.length - 1] == "*" || exp[exp.length - 1] == "/" ||
           exp[exp.length - 1] == "." || exp == "Error")
        {
            document.form1.textView.value = "Error";
        }
        else
        {
            ExpToRPN(exp);
            console.log(currentExp);
            document.form1.textView.value = RPNToExp(currentExp);
        }
        isDouble = false;
        BeenAns = true;
        isNeg = false;
    }   
}

//#endregion Анимация при нажатии
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