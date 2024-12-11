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
//משתנה עבור סכום סופי של העגלת קניות ואינדקס הפריט בעגלת קניות
let totalPrice = 0;

//אורך עגלת הקניות - נגדיל כל פעם שנוסף מוצר
let height = 500;



//פונקציה שמוסיפה אלמנט לסל הקניות
function addItem(buttonElemnt){

    //נקבל את אלמנט הכרטיס שבו כל המידע על אותו פריט
    let outElemnt = buttonElemnt.closest('.contentCard');
    
    //נשמור את שם הפריט, התמונה והמחיר
    let itemName = outElemnt.querySelector('h2').textContent;
    
    let price = outElemnt.querySelector('.priceForOne').textContent.replace(/[^0-9.]/g, '');//נוריד את כל מה שהוא לא ספרה או נקודה
    console.log(price);   
    
    let srcImg = outElemnt.querySelector('img').src;


    //האם המוצר כבר נמצא בעגלת קניות - אם לא אז נוסיף
    if(!noDuplicateItemInCart(itemName)){

        createItemObg(itemName, Number(price));//נקרא לפונקציה שיוצרת אלמנט
        
        //נגדיל את אורך העגלה
        if(ItemsArr.length > 2){
            height += 100;
            document.getElementById('cartSide').style.height = height + 'px';
        }

        //נוסיף את הפריט לעגלת הקניות - באופן מוחשי
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
    console.log(ItemsArr.length +'index');
    ItemsArr.push(new Item(itemName, price, 1, ItemsArr.length)); //הוספה למערך המוצרים את הפריט החדש שנוסף
    console.log(price);
        
    //שינוי המחיר הסופי המוצג
    totalPrice += price;

    console.log(totalPrice);    
    document.getElementById('priceCart').innerText = `סה"כ לתשלום: ${totalPrice.toFixed(2)} \u20AA `; //הצגת המחיר הסופי המעודכן
    
    document.getElementById('emptyCartP').style.display = "none";

}


//פונקציה שמשנה את הכמות פריטים מאותו מוצר - ע"י קבלת אלמנט שמאחסן בתוכו סימן של פלוס/מינוס
function changeAmount(signElement){
    let sign = signElement.textContent; //שמירת הסימן - פלוס או מינוס
    let itemInfo = signElement.closest('.itemInfo'); // ניקח את האלמנט אב הכי קרוב עם הקלאס הרלוונטי - שמאחסן בתוכו את פריטי המוצר
    let itemName = itemInfo.querySelector('h2').textContent;
    let inputAmount = itemInfo.querySelector('.inputAmount');//תיבת קלט שמציגה את כמות הפריטים מהמוצר
    
    //נמצא את האובייקט שלו רוצים להוסיף בכמות
    let obgItem = ItemsArr.find(item => {
           return item.name == itemName;
    }); 
    
    //נשמור את הכמות הקודמת
    let prevamount = obgItem.amount;

    //שינוי הכמות באובייקט עצמו ובמסך
    if(sign == '+'){
        //מגבלה של עד 10 פריטים ממוצר מסוים
        if(obgItem.amount < 10){
            obgItem.amount += 1;
            inputAmount.value = obgItem.amount; //שינוי הכמות בתיבת קלט על המסך
        }
        else
            alert ('אין אפשרות ליותר מ-10 פריטים מאותו מוצר');
    }
    //מגבלה של לפחות פריט אחד ממוצר מסוים
    else if(sign == '-'){
        if(obgItem.amount > 1){
            obgItem.amount -= 1;
            inputAmount.value = obgItem.amount; //שינוי הכמות בתיבת קלט על המסך
        }
        else
            alert('אין אפשרות לפחות מפריט 1 עבור מוצר מסוים. ניתן להסירו לגמרי');
    }
    changePrice(itemInfo, obgItem, prevamount);
}



//פונקציה שאחראית לשנות את המחיר  
function changePrice(itemInfo, obgItem, prevamount){
    
    let priceShow = itemInfo.querySelector('.priceInCart');//ניקח את המחיר הרשום עבור המוצר
    priceShow.innerText = '\u20AA' + (obgItem.amount * obgItem.priceMekori).toFixed(2); //נעדכן את המחיר על המסך
    
    //נשנה את המחיר הסופי    
    totalPrice -= prevamount * obgItem.priceMekori;
    totalPrice += obgItem.amount * obgItem.priceMekori;
   
    // totalPrice.tofixed(2) - בלי זה זה עושה מחיר מאוד ארוך, למה ??
    document.getElementById('priceCart').innerHTML = `<span>סה"כ לתשלום: ${totalPrice.toFixed(2)} \u20AA </span>`;//נעדכן את המחיר החדש במסך
}



//פונקציה שדואגת שמוצר שנמצא בעגלה לא יתווסף בשנית
function noDuplicateItemInCart(itemName){   
    return ItemsArr.find(item => {
           return item.name == itemName;
    });
}



//פונקציה שמוחקת פריט מעגלת הקניות  - ע"י קבלת אלמנט 'הסר' י
function deleteItemFromCart(removeElemntBtn){
    // נקבל את כל המידע על הפריט שנמצא בעגלה 
    let itemInfoElement = removeElemntBtn.closest('li');
    itemInfoElement.style.display = 'none'; //באופן מוחשי - נוריד את הפריט מסל הקניות 
    let nameItem = itemInfoElement.querySelector('h2').textContent; //ניקח את שם הפריט

    //מציאת האובייקט במערך שאותו רוצים למחוק
    let objectToRemove = ItemsArr.find((item) => {
            return item.name == nameItem;
    }); 

    totalPrice -= objectToRemove.priceMekori * objectToRemove.amount; //הורדה של המחיר המקורי כפול הכמות

    //totalPrice.tofixed(2)
    document.getElementById('priceCart').innerText = `סה"כ לתשלום: ${totalPrice.toFixed(2)} \u20AA`; //הצגה של המחיר החדש על המסך
    console.log(totalPrice);
    
    ItemsArr.splice(objectToRemove.index, 1); //נמחק מהמערך את האובייקט הרלוונטי
    changeIndex();

    if(ItemsArr.length == 0)
        document.getElementById('emptyCartP').style.display = "block";
}


//פונקציה שמחזירה מספר רנדומלי - עבור פריט שאינו ברשימה
function randomPrice(){
    let price = Math.round(Math.random() * 10) + 1;
    return Number(price.toFixed(2));
}


//הוספת פריט שהוא לא מהרשימה המוצגת למשתמש
function addItemNotFromOptions(){

    let itemName = document.getElementById('inputItem').value;

    //האם המוצר כבר נמצא בעגלת קניות - אם לא אז נוסיף
    if(!noDuplicateItemInCart(itemName)){

        let price = randomPrice();
        createItemObg(itemName, price);//נקרא לפונקציה שיוצרת אלמנט
        
       //נגדיל את אורך העגלה
       if(ItemsArr.length > 2){
        height += 100;
        document.getElementById('cartSide').style.height = height + 'px';
    }

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


//שינוי האינדקס של האלמנטים בעגלת קניות - אחרי מחיקה האלמנטים זזים והאינדקס משתשנה
function changeIndex(){
    for(let i = 0; i < ItemsArr.length; i++){
        ItemsArr[i].index = i;
    }   
}