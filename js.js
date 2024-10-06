//TODO: איך עושים מספרים מחדש לרשימה אחרי מחיקה של פריט   
//TODO: שמוסיפים 3 פריטים שעולים מספר לא שלם פתאום המחיר הסופי בקונסול נהיה עם הרבה מספרים אחרי הנקודה העשרוניתו וזה לא אמור להיות ככה.

//מחלקה של פריט
class Item{

    constructor(itemName, priceMekori, amount, index){
        this.name = itemName;
        this.priceMekori = priceMekori;
        this.amount = amount;
        this.index = index;
    }

    get(prop){
        return this[prop];
    }

    set(prop, newValue){
        this[prop] = newValue;
    }
}

//מערך שמאחסן בתוכו את כל האובייקטים מסוג פריט שנוספו לסל הקניות
let ItemsArr = [];
let totalPrice = 0;
let countIndex = 0;



//פונקציה שמוסיפה אלמנט לסל הקניות
function addItem(buttonElemnt){

    //נקבל את אלמנט הכרטיס שבו כל המידע על אותו פריט
    let outElemnt = buttonElemnt.closest('.contentCard');
    console.log(outElemnt);
    
    //נשמור את שם הפריט, התמונה והמחיר
    let itemName = outElemnt.querySelector('h2').textContent;
    console.log(itemName);
    
    let price = outElemnt.querySelector('.priceForOne').textContent.replace(/[^0-9.]/g, '');//נוריד את כל מה שהוא לא ספרה או נקודה
    price = Number(price).toFixed(2); //שהמחיר יוצג בתבנית אחידה

    console.log(price);
    

    let srcImg = outElemnt.querySelector('img').src;

    //האם המוצר כבר נמצא בעגלת קניות - אם לא אז נוסיף
    if(!noDuplicateItemInCart(itemName)){

        createItemObg(itemName, price);//נקרא לפונקציה שיוצרת אלמנט
        
        //נוסיף את הפריט לעגלת הקניות 
        document.getElementById('listItems').innerHTML += `<li>
        <div class="itemInfo">
            <div style="display:flex;width:100%;align-items: center;gap:10px">
                <img src="${srcImg}"> 
                <h2>${itemName}</h2>
                <span class="priceInCart">\u20AA${price}</span>
                <span style="margin-right:auto;color:red;cursor:pointer" onclick="deleteItemFromCart(this)">הסר</span>
            </div>
            <div class="AmountDiv">
                    <span class="minus" onclick="changeAmount(this)">-</span>
                    <input class="inputAmount" type="text" value="1" inputmode="numeric" min="1">
                    <span class="plus" onclick="changeAmount(this)">+</span>
            </div>
        </div>
        </li>`;

    }
   
}


//יצירת אובייקט 'פריט' חדש והכנסתו למערך הפריטים
function createItemObg(itemName, price){
    console.log(countIndex +'index');
    ItemsArr.push(new Item(itemName, price, 1, countIndex)); //הוספה למערך המוצרים את הפריט החדש שנוסף
    console.log(ItemsArr);
    console.log(price);
    
    //שינוי המחיר הסופי המוצג
    price = Number(price);
    totalPrice += price;

    console.log(totalPrice);    
    document.getElementById('priceCart').innerHTML = `<p>סה"כ לתשלום: ${totalPrice.toFixed(2)} \u20AA </p>`; //הצגת המחיר הסופי המעודכן

    countIndex++
    
    document.getElementById('emptyCartP').style.display = "none";

}


//פונקציה שמשנה את הכמות פריטים מאותו מוצר
function changeAmount(singElement){
    let sign = singElement.textContent; //שמירת הסימן - פלוס או מינוס
    let itemInfo = singElement.closest('.itemInfo'); //ניקח את האלמנט אב הכי קרוב עם הקלאס הרלוונטי
    console.log(itemInfo);
    let itemName = itemInfo.querySelector('h2').textContent;
    console.log(itemName);
    let inputAmount = itemInfo.querySelector('.inputAmount');
    console.log(inputAmount);
    
    //נמצא את האובייקט שלו רוצים להוסיף בכמות
    let obgItem = ItemsArr.find(item => {
        if(item != null)
           return item.name == itemName;
    }); 
    

    let prevAmount = obgItem.amount; //שמירת הכמות הקודמת של האובייקט

    //שינוי הכמות באובייקט עצמו ובמסך
    if(sign == '+'){
        if(obgItem.amount < 10){
            obgItem.amount += 1;
            console.log(obgItem.amount);
            inputAmount.value = obgItem.amount;
        }
        else
            alert ('אין אפשרות ליותר מ-10 פריטים מאותו מוצר');
    }
    else if(sign == '-'){
        if(obgItem.amount > 1){
            obgItem.amount -= 1;
            console.log(obgItem.amount);
            inputAmount.value = obgItem.amount;
        }
        else
            alert('אין אפשרות לפחות מפריט 1 עבור מוצר מסוים. ניתן להסירו לגמרי');
    }
    console.log(obgItem);

    changePrice(itemInfo, obgItem, prevAmount);
}



//פונקציה שאחראית לשנות את המחיר על המסך
function changePrice(itemInfo, obgItem, prevAmount){
    console.log(prevAmount +'prevamount');
    
    let priceShow = itemInfo.querySelector('.priceInCart');
    priceShow.innerText = '\u20AA' + (obgItem.amount * obgItem.priceMekori).toFixed(2); //נעדכן את המחיר על המסך

    console.log(obgItem.amount + 'amount');

    console.log(obgItem.priceMekori * obgItem.amount);
    
     //נשנה את המחיר הסופי    
    totalPrice -= prevAmount * obgItem.priceMekori;
    totalPrice += obgItem.amount * obgItem.priceMekori;

    console.log(totalPrice + 'price');
    document.getElementById('priceCart').innerHTML = `<span>סה"כ לתשלום: ${totalPrice} \u20AA </span>`;
}



//פונקציה שדואגת שמוצר שנמצא בעגלה לא יתווסף בשנית
function noDuplicateItemInCart(itemName){   
    return ItemsArr.find(item => {
        if(item != null)
           return item.name == itemName;
    });
}



//פונקציה שמוחקת פריט מעגלת הקניות
function deleteItemFromCart(removeElemnt){
    let itemInfoElement = removeElemnt.closest('li');
    console.log(itemInfoElement);
    itemInfoElement.style.display = 'none'; //נוריד את הפריט מסל הקניות 
    console.log(itemInfoElement.querySelector('h2')); 
    let nameItem = itemInfoElement.querySelector('h2').textContent; //ניקח את שם הפריט
    console.log(nameItem);
    let objectToRemove = ItemsArr.find((item) => {
            return item.name == nameItem;
    }); //מציאת האובייקט במערך שאותו רוצים למחוק
    console.log(objectToRemove);
    totalPrice -= objectToRemove.priceMekori * objectToRemove.amount; //הורדה של המחיר המקורי כפול הכמות
    document.getElementById('priceCart').innerHTML = `<p> סה"כ לתלשום: ${totalPrice} \u20AA</p>`;
    console.log(totalPrice);
    console.log(objectToRemove.name, ItemsArr[objectToRemove.index]);
    
    ItemsArr.splice(objectToRemove.index, 1); //נמחק מהמערך את האובייקט הרלוונטי
    console.log(ItemsArr);    
    changeIndex()
}


//פונקציה שמחזירה מספר רנדומלי
function randomPrice(){
    let price = Math.round(Math.random() * 10) + 1;
    return price;
}


//הוספת פריט שהוא לא מהרשימה המוצגת למשתמש
function addItemNotFromOptions(){

    let itemName = document.getElementById('inputItem').value;

    //האם המוצר כבר נמצא בעגלת קניות - אם לא אז נוסיף
    if(!noDuplicateItemInCart(itemName)){

        let price = randomPrice();
        createItemObg(itemName, price);//נקרא לפונקציה שיוצרת אלמנט
        
        //נוסיף את הפריט לעגלת הקניות 
        document.getElementById('listItems').innerHTML += `<li>
        <div class="itemInfo">
            <div style="display:flex;width:100%;align-items: center;gap:10px">
                <h2>${itemName}</h2>
                <span class="priceInCart">\u20AA${price}</span>
                <span style="margin-right:auto;color:red;cursor:pointer" onclick="deleteItemFromCart(this)">הסר</span>
            </div>
            <div class="AmountDiv">
                    <span class="minus" onclick="changeAmount(this)">-</span>
                    <input class="inputAmount" type="text" value="1" inputmode="numeric" min="1">
                    <span class="plus" onclick="changeAmount(this)">+</span>
            </div>
        </div>
        </li>`;
    }

    document.getElementById('inputItem').value = ""; //ניקוי התיבה 

}


//הוספת פריט מחוץ לרשימה על ידי אנטר
document.getElementById('inputItem').addEventListener('keypress', event => {
    console.log(event);
    if(event.key == 'Enter')
        addItemNotFromOptions(document.getElementById('addItemExternal'));
})


//שינוי האינדקס של האלמנט - אחרי מחיקה האלמנטים זזים והאינדקס משתשנה
function changeIndex(){
    for(let i = 0; i < ItemsArr.length; i++){
        ItemsArr[i].index = i;
        console.log(ItemsArr[i].index,  ItemsArr[i].name);
    }

    console.log(ItemsArr);
    
}